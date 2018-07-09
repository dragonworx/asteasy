export class ContextFactory {
  create(config) {
    return new ContextImpl(config);
  }
}