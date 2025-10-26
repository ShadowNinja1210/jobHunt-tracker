declare module "swagger-ui" {
  export type SwaggerUIInstance = { destroy?: () => void };
  export type SwaggerUIOptions = { domNode: Element; url?: string } & Record<
    string,
    unknown
  >;
  export default function SwaggerUI(opts: SwaggerUIOptions): SwaggerUIInstance;
}
