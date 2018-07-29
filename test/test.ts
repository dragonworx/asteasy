export class ContextFactory {
  public static create(config: ContextConfig): Context {
    const a = <abc>foo</abc>;
    return new ContextImpl(config);
  }
}