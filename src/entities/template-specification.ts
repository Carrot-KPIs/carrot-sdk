interface Version {
  major: number
  minor: number
  patch: number
}

export interface KpiTokenTemplateSpecification {
  version: Version
  name: string
  description: string
  tags: string[]
}

export interface OracleTemplateSpecification extends KpiTokenTemplateSpecification {
  automatable: boolean
}
