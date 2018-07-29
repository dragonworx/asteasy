export class ContextFactory {
  create(config) {
    const a = <abc>foo</abc>;
    return new ContextImpl(config);
  }
}