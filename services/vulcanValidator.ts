import { SymbolicScar, JustifiedUncertaintyReport } from '../types';

export class TopologyViolationError extends Error {
  public report: JustifiedUncertaintyReport;

  constructor(report: JustifiedUncertaintyReport) {
    super(report.message);
    this.name = 'TopologyViolationError';
    this.report = report;
  }
}

export class VulcanTopologyValidator {
  private static scarArchive: SymbolicScar[] = [
    {
      scarId: 'SCAR-001',
      pattern: 'distributed monolith|microservices without boundaries',
      betti1: 1,
      fipiVector: { dimensions: [1, 0, 0], magnitude: 1 },
      pdlDecorators: [
        '+++MereologyRoute(relation_type="Component-Object", transitivity_check=true)',
        '+++AutonymicIsolate(forbidden_content=["distributed_monolith"])'
      ]
    },
    {
      scarId: 'SCAR-002',
      pattern: 'shared database|common schema across contexts',
      betti1: 1,
      fipiVector: { dimensions: [0, 1, 0], magnitude: 1 },
      pdlDecorators: [
        '+++AutonymicIsolate(forbidden_content=["shared_database_pattern"])',
        '+++MereologyRoute(relation_type="Component-Object", transitivity_check=true)'
      ]
    },
    {
      scarId: 'SCAR-003',
      pattern: 'perfect consistency and availability during partition|cap theorem violation',
      betti1: 1,
      fipiVector: { dimensions: [0, 0, 1], magnitude: 1 },
      pdlDecorators: [
         '+++AutonymicIsolate(forbidden_content=["cap_theorem_violation"])'
      ]
    }
  ];

  public static assessIntentTopology(intent: string): { pdlDecorators: string[] } {
    const lowercaseIntent = intent.toLowerCase();

    // Circuit Breaker: Epistemic Escrow
    if (lowercaseIntent.includes('perfect consistency and availability during partition')) {
       throw new TopologyViolationError({
         violatedConstraints: ['CAP Theorem'],
         cfdiScore: 1.0, // High score since it's impossible
         correctiveProposals: ['Choose between Consistency and Availability during a partition.'],
         message: 'Epistemic Escrow Triggered: Impossible synthesis requested.'
       });
    }

    let activeDecorators: string[] = [];

    // Check against Scar Archive
    for (const scar of this.scarArchive) {
      const regex = new RegExp(scar.pattern, 'i');
      if (regex.test(lowercaseIntent)) {
        activeDecorators = [...activeDecorators, ...scar.pdlDecorators];
      }
    }

    // Apply Bricolage Lens (stripping hype words)
    // Simplified version: just inject a decorator if hype words are detected.
    if (lowercaseIntent.match(/cloud-native|scalable|web3/)) {
        activeDecorators.push('+++AdjectivalBound(max=0)');
    }

    // Remove duplicates
    activeDecorators = [...new Set(activeDecorators)];

    return { pdlDecorators: activeDecorators };
  }
}
