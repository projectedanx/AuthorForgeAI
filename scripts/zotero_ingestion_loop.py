#!/usr/bin/env python3
import os
import sys
import time
import uuid
import yaml
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Ensure these packages are installed: pip install watchdog pdfplumber pyyaml
try:
    import pdfplumber
except ImportError:
    print("pdfplumber not installed. Please run: pip install pdfplumber")
    sys.exit(1)

class ZoteroPDFHandler(FileSystemEventHandler):
    def __init__(self, manifest_path="pkc_manifest.yml"):
        self.manifest_path = manifest_path
        super().__init__()

    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith('.pdf'):
            print(f"Detected new PDF: {event.src_path}")
            self.process_pdf(event.src_path)

    def process_pdf(self, pdf_path):
        print(f"Extracting metadata and text from {pdf_path}...")
        text_content = ""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages[:3]: # Extract first 3 pages as a sample
                    text = page.extract_text()
                    if text:
                        text_content += text + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return

        print("Running simulated local Llama-3-8B extraction...")
        # Simulated extraction of arguments and relationships
        title = os.path.basename(pdf_path)
        new_node_uuid = f"urn:uuid:{uuid.uuid4()}"

        # Load the manifest
        try:
            with open(self.manifest_path, 'r') as f:
                manifest = yaml.safe_load(f)
        except Exception as e:
            print(f"Error reading manifest: {e}")
            return

        # Create new node
        new_node = {
            'node_uuid': new_node_uuid,
            'title': f"[Auto-Ingested] {title}",
            'content_path': pdf_path,
            'node_type': 'PDF_Atom',
            'status': 'transient',
            'version_number': 1,
            'epistemic_tag': 'hypothetical',
            'meaning_space_anchor': {
                'prototypical_vector': [0.0, 0.0, 0.0, 0.0, 0.0], # Simulated vector
                'hyperspherical_radius': 0.1,
                'embedding_model': 'text-embedding-3-small'
            },
            'metadata_fields': {
                'epistemic_risk_level': 'High',
                'architectural_layer': 'Unprocessed_Intake',
                'implementation_horizon': 'Review_Required'
            }
        }

        manifest.setdefault('content_nodes', []).append(new_node)

        # Optionally, create a pending directed edge if nodes exist
        if len(manifest['content_nodes']) > 1:
            target_node_uuid = manifest['content_nodes'][0]['node_uuid']
            new_edge = {
                'edge_uuid': f"urn:uuid:{uuid.uuid4()}",
                'source_node': new_node_uuid,
                'target_node': target_node_uuid,
                'predicate': 'is_supported_by', # Simulated relationship
                'weight': 0.5,
                'created_by_agent': 'local_ingestion_script'
            }
            manifest.setdefault('semantic_edges', []).append(new_edge)

        # Write back to manifest
        try:
            with open(self.manifest_path, 'w') as f:
                yaml.safe_dump(manifest, f, default_flow_style=False)
            print(f"Successfully added node to {self.manifest_path} for {title}")
        except Exception as e:
            print(f"Error writing manifest: {e}")

if __name__ == "__main__":
    path_to_watch = sys.argv[1] if len(sys.argv) > 1 else "."
    print(f"Starting Zotero Ingestion Loop watcher on directory: {path_to_watch}")

    event_handler = ZoteroPDFHandler()
    observer = Observer()
    observer.schedule(event_handler, path_to_watch, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
