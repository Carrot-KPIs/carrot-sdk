export interface KpiTokenTemplateSpecification {
  name: string
  description: string
  tags: string[]
}

export interface OracleTemplateSpecification extends KpiTokenTemplateSpecification {
  automatable: boolean
}
