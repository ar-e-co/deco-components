import { fetchAPI } from "apps/utils/fetch.ts";

type SpecificationId = string;
type SpecificationFieldId = number;
type SpecificationFieldValue = string;

// NOTE: Decorators only works with interfaces
/** @title {{id}} - {{fieldName}} */
export interface SpecificationAdminConfig {
  /**
   * @title Identifier
   * @description Used as key to specifications dictionary. This is a way to find important specifications across different stores, even if their names may vary.
   * @example Setting an identifier "color" for a specification which can be named "Cor" or "Cor Produto" on different stores. This is necessary to find the correct specification within product context
   */
  id: SpecificationId;
  /**
   * @title Specification ID
   * @description Specification ID in VTEX Catalog
   */
  fieldId: SpecificationFieldId;
  /**
   * @title Specification Name
   * @description Specification name in VTEX Catalog
   */
  fieldName: SpecificationFieldValue;
  /**
   * @title Fetch List from API
   * @description If true, will fetch the list of values from the API
   * @default false
   */
  fetchListFromAPI?: boolean;
  /**
   * @title Type
   * @description Type of specification. Can be either "sku" or "product"
   * @default "product"
   */
  type: "product" | "sku";
}

interface NativeSpecificationValue {
  FieldValueId: number;
  Value: string;
  IsActive: boolean;
  Position: number;
}

export interface Specification {
  id: SpecificationId;
  fieldId: SpecificationFieldId;
  fieldName: SpecificationFieldValue;
  values: Record<string, NativeSpecificationValue>;
}

export interface BaseStoreConfig<
  S extends string = string,
  C extends string = string,
> {
  accountName: string;
  storeURL: string;
  specifications?: {
    [key in S]: Specification;
  };
  constants?: {
    [key in C]: string;
  };
}

/** @title {{key}} - {{value}} */
interface Constant {
  key: string;
  value: string;
}

export interface Props {
  /** @description Conforme a VTEX. Ex: simplesreserva */
  accountName: string;
  /** @title Store URL */
  /** @description ex: https://www.simplesreserva.com */
  storeURL: string;
  specifications?: SpecificationAdminConfig[];
  constants?: Array<Constant>;
}

async function storeConfig(
  {
    constants: constantsList,
    specifications: specificationsList,
    accountName,
    storeURL,
  }: Props,
  _req: Request,
): Promise<BaseStoreConfig> {
  try {
    const constants = constantsList?.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) ?? {};

    let specificationsToFetch: SpecificationAdminConfig[] = [];
    let specificationsToReturn: Record<string, Specification> = {};

    specificationsList?.forEach((specification) => {
      if (specification.fetchListFromAPI) {
        specificationsToFetch = [...specificationsToFetch, specification];
      } else {
        specificationsToReturn = {
          ...specificationsToReturn,
          [specification.id]: {
            id: specification.id,
            fieldId: specification.fieldId,
            fieldName: specification.fieldName,
            values: {},
          },
        };
      }
    });

    const specsValues = await Promise.all(
      specificationsToFetch.map(async (specification) => {
        const data: NativeSpecificationValue[] = await fetchAPI(
          `https://${accountName}.vtexcommercestable.com.br/api/catalog_system/pub/specification/fieldvalue/${specification.fieldId}`,
        );

        const values = data.reduce(
          (
            acc: Record<string, NativeSpecificationValue>,
            spec: NativeSpecificationValue,
          ) => {
            acc[spec.Value] = spec;
            return acc;
          },
          {} as Record<string, NativeSpecificationValue>,
        );

        return {
          id: specification.id,
          fieldId: specification.fieldId,
          fieldName: specification.fieldName,
          values,
        };
      }),
    );

    const reducedSpecs = specsValues.reduce(
      (acc: Record<string, Specification>, spec) => {
        acc[spec.id] = spec;
        return acc;
      },
      {} as Record<string, Specification>,
    );

    return {
      constants,
      accountName,
      storeURL,
      specifications: {
        ...specificationsToReturn,
        ...reducedSpecs,
      },
    };
  } catch (e) {
    return e;
  }
}

export default storeConfig;
