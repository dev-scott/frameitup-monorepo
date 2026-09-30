const functionName = Symbol.for("functionName");

function createApi(pathParts: string[] = []): any {
  const handler: ProxyHandler<any> = {
    get(_, prop) {
      if (typeof prop === "string") {
        return createApi([...pathParts, prop]);
      } else if (prop === functionName) {
        if (pathParts.length < 2) {
          const found = ["api", ...pathParts].join(".");
          throw new Error(
            `API path is expected to be of the form \`api.moduleName.functionName\`. Found: \`${found}\``
          );
        }
        const path = pathParts.slice(0, -1).join("/");
        const exportName = pathParts[pathParts.length - 1];
        if (exportName === "default") {
          return path;
        } else {
          return path + ":" + exportName;
        }
      } else if (prop === Symbol.toStringTag) {
        return "FunctionReference";
      } else {
        return undefined;
      }
    },
  };
  return new Proxy({}, handler);
}

/**
 * Référence universelle et client-safe vers l'API Convex (requêtes et mutations)
 */
export const api = createApi();
