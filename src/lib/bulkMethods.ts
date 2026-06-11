// AUTO-GENERATED from the Notion "Bulk example files" catalogue.
// Each entry documents one bulk-import method (entity x action) with its goal,
// mandatory fields, particularities, and example .xlsx file.

export type BulkMethod = {
  entity: string;
  action: string;
  group: string;
  fileUrl: string;
  fileName: string;
  goal: string;
  mandatoryFields: string[];
  notes: string[];
};

export const BULK_GROUPS = ["Product", "Codification", "Tasks & Seeds"] as const;

export const BULK_METHODS: BulkMethod[] = [
  {
    "entity": "Assortment",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-upsert.xlsx",
    "fileName": "bulk-assortment-upsert.xlsx",
    "goal": "Create or update assortments for a specific client and store. Assortments link client SKUs to a store, either automatically or manually.",
    "mandatoryFields": [
      "clientId",
      "storeId",
      "isAutomatic",
      "isMultiMatching"
    ],
    "notes": [
      "Upsert logic: if id is provided the process updates the existing entity; if omitted it creates a new one.",
      "id, clientId and storeId are non-editable; isAutomatic, isMultiMatching, activeFrom and activeTo are editable.",
      "isAutomatic=TRUE auto-assigns all clientSkus matching the assortment's clientId and the store's countryCode; if manual, clientSkus must be linked via assortmentClientSku relations.",
      "A separate bulk process exists to create assortmentClientSku relations.",
      "Changing an assortment from manual to automatic does not delete existing assortmentClientSkus; they are simply no longer used.",
      "activeFrom and activeTo are optional Date fields (e.g. 2025-02-01)."
    ]
  },
  {
    "entity": "Assortment",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-delete.xlsx",
    "fileName": "bulk-assortment-delete.xlsx",
    "goal": "Delete an assortment via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The 'id' field is the id of the assortment entity in the assortment table of the product_api database.",
      "Assortment is a sensitive relationship; its dependencies are NOT automatically removed.",
      "If any active relations exist, an exception message appears and no action is taken until you manually delete the dependencies."
    ]
  },
  {
    "entity": "Assortment Client Sku",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-client-sku-upsert.xlsx",
    "fileName": "bulk-assortment-client-sku-upsert.xlsx",
    "goal": "Create or update the relationship between a clientSku (product) and an assortment by assigning the clientSku to an assortment with a specified validity period.",
    "mandatoryFields": [
      "assortmentId",
      "clientSkuId"
    ],
    "notes": [
      "Upsert logic: if the `id` field is provided, it updates the existing entity; if not, it creates a new one.",
      "These relationships are only used when the associated assortment is manual (isAutomatic=FALSE).",
      "assortmentId and clientSkuId are both mandatory UUIDs and non-editable.",
      "activeFrom and activeTo are optional, editable Date fields (e.g. 2025-02-01) defining the validity period."
    ]
  },
  {
    "entity": "Assortment Client Sku",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-client-sku-delete.xlsx",
    "fileName": "bulk-assortment-client-sku-delete.xlsx",
    "goal": "Delete an assortmentClientSku relation via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Single field 'id': the id of the assortmentClientSku entity on the assortment_client_sku table of the product_api database.",
      "id is the only field and is mandatory; it identifies the relation row to delete."
    ]
  },
  {
    "entity": "Assortment Region Store",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-region-store-upsert.xlsx",
    "fileName": "bulk-assortment-region-store-upsert.xlsx",
    "goal": "Create or update assortments for a specific client, region and store. If the id field is provided, the process updates the existing entity; if not, it creates a new one.",
    "mandatoryFields": [
      "clientId",
      "regionId",
      "storeId",
      "mode"
    ],
    "notes": [
      "Upsert logic: providing id updates the existing entity; omitting id creates a new one.",
      "mode is an ENUM with values MANUAL or REGIONAL and is the only mandatory field that is editable.",
      "If mode is REGIONAL, all clientSkus with the same clientId associated with the same regionId are assigned automatically; if MANUAL, clientSkus must be linked manually via assortmentRegionStoreClientSku relations.",
      "A separate bulk process exists to create assortmentRegionStoreClientSku relations.",
      "When changing an assortment from MANUAL to REGIONAL, the existing assortmentRegionStoreClientSkus must be removed manually first.",
      "id, clientId, regionId and storeId are non-editable (UUIDs); activeFrom and activeTo are optional editable Date fields."
    ]
  },
  {
    "entity": "Assortment Region Store",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-region-store-delete.xlsx",
    "fileName": "bulk-assortment-region-store-delete.xlsx",
    "goal": "Delete an assortmentRegionStore entity via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The only field is 'id': the id of the assortment entity on the assortment_region_store table of the product_api database.",
      "Assortment is a sensitive relationship, so its dependencies are NOT automatically removed.",
      "If any active relations exist, an exception message appears and no action is taken until the dependencies are manually deleted."
    ]
  },
  {
    "entity": "Assortment Region Store Client Sku",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-region-store-client-sku-upsert.xlsx",
    "fileName": "bulk-assortment-region-store-client-sku-upsert.xlsx",
    "goal": "Create or update the relationship between a clientSku and an assortmentRegionStore by assigning a clientSku (product) to an assortmentRegionStore with a specified validity period.",
    "mandatoryFields": [
      "assortmenRegionStoretId",
      "clientSkuId"
    ],
    "notes": [
      "Upsert logic: if the id field is provided, the existing entity is updated; if omitted, a new one is created.",
      "These relationships are only used when the associated assortment is set to manual (mode=MANUAL).",
      "Mandatory fields assortmenRegionStoretId and clientSkuId are both UUIDs and non-editable.",
      "Optional editable fields: activeFrom and activeTo (Date type, e.g. 2025-02-01) defining the validity period."
    ]
  },
  {
    "entity": "Assortment Region Store Client Sku",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-assortment-region-store-client-sku-delete.xlsx",
    "fileName": "bulk-assortment-region-store-client-sku-delete.xlsx",
    "goal": "Delete an assortmentRegionStoreClientSku relation. Only used for MANUAL assortmentRegionStore.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Only applicable to assortmentRegionStore of type MANUAL.",
      "The single field 'id' is the id of the assortmentRegionStoreClientSku entity on the assortment_region_store_client_sku table in the product_api database.",
      "id is the only field and it is mandatory."
    ]
  },
  {
    "entity": "Business Unit",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-business-unit-delete.xlsx",
    "fileName": "bulk-business-unit-delete.xlsx",
    "goal": "Delete a business unit via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Only field is 'id' = id of the businessUnit entity in the business_unit table of the product_api database.",
      "Business unit is a sensitive relationship; its dependencies are NOT automatically removed.",
      "If active relations exist, an exception message appears and no action is taken until dependencies are manually deleted first."
    ]
  },
  {
    "entity": "Client Category",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-category-delete.xlsx",
    "fileName": "bulk-client-category-delete.xlsx",
    "goal": "Delete a clientCategory.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "id refers to the id of the clientCategory entity in the client_category table of the product_api database.",
      "A client category is a sensitive relationship; its dependencies are NOT automatically removed.",
      "If any active relations exist, an exception message appears and no action is taken until you manually delete the dependencies first."
    ]
  },
  {
    "entity": "Client Sku",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-upsert.xlsx",
    "fileName": "bulk-client-sku-upsert.xlsx",
    "goal": "Create or update client SKUs (products) for a specific client and brand within a particular country.",
    "mandatoryFields": [
      "codes.sku_code",
      "brandId",
      "title",
      "countryCode",
      "clientId",
      "isHero",
      "units"
    ],
    "notes": [
      "Upsert logic: if id is provided the existing entity is updated; if omitted a new one is created.",
      "id is the only non-editable field; all other fields are editable because product details change frequently.",
      "msrpValue/msrpCurrency are composite: you must provide both or neither is saved (e.g. msrpValue 7 + msrpCurrency 'EUR').",
      "volumeValue/volumeUnits are composite: provide both parts or neither is stored.",
      "countryCode is an Enum (e.g. ES); msrpCurrency is an Enum (e.g. EUR); isHero is a Boolean.",
      "id and brandId/clientId/categoryId/etc. are UUID-typed."
    ]
  },
  {
    "entity": "Client Sku",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-delete.xlsx",
    "fileName": "bulk-client-sku-delete.xlsx",
    "goal": "Delete a clientSku and its related records, including assortmentClientSku, clientSkuCompetitorSku, skuImageReference, skuRetailerImageReference, skuRetailerTextReference and skuTextReference.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Single field 'id' is the only column and it is mandatory.",
      "'id' refers to the id of the clientSku entity on the client_sku table of the product_api database.",
      "Deleting a clientSku cascades to remove its relations (assortmentClientSku, clientSkuCompetitorSku, skuImageReference, skuRetailerImageReference, skuRetailerTextReference, skuTextReference)."
    ]
  },
  {
    "entity": "Client SKU - Competitor SKU",
    "action": "Create",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-competitor-sku-create.xlsx",
    "fileName": "bulk-client-sku-competitor-sku-create.xlsx",
    "goal": "Create a relation between a clientSku and a competitorSku. Because this is a relationship between two entities, it cannot be updated directly.",
    "mandatoryFields": [
      "clientSkuId",
      "competitorSkuId"
    ],
    "notes": [
      "Both fields (clientSkuId and competitorSkuId) are mandatory and non-editable.",
      "Both fields are of data type UUID.",
      "Relations cannot be updated directly; to change one, delete the existing relation and create a new, correct one."
    ]
  },
  {
    "entity": "Client SKU - Competitor SKU",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-competitor-sku-delete.xlsx",
    "fileName": "bulk-client-sku-competitor-sku-delete.xlsx",
    "goal": "Delete clientSku-competitorSku relationships in bulk.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The 'id' field is the id of the entity on the client_sku_competitor_sku table of the product_api database.",
      "Only one field exists for this method and it is mandatory: id.",
      "This is a delete-by-id operation; rows are identified solely by their existing id."
    ]
  },
  {
    "entity": "Client Sku Attribute Option",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-attribute-option-upsert.xlsx",
    "fileName": "bulk-client-sku-attribute-option-upsert.xlsx",
    "goal": "Associate clientSkus with AttributeOptions via bulk upsert.",
    "mandatoryFields": [
      "clientSkuId",
      "attributeOptionId"
    ],
    "notes": [
      "Both fields (clientSkuId, attributeOptionId) are mandatory.",
      "Both fields are non-editable.",
      "Both fields are of data type UUID.",
      "Upsert keys on the clientSkuId + attributeOptionId pair to link the two records.",
      "No callouts or per-type special rules documented beyond the Fields table."
    ]
  },
  {
    "entity": "Client Sku Attribute Option",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-attribute-option-delete.xlsx",
    "fileName": "bulk-client-sku-attribute-option-delete.xlsx",
    "goal": "Delete a clientSku-attributeOption relation.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The only field is 'id': the id of the clientSkuAttributeOption entity on the client_sku_attribute_option table of the product_api database.",
      "id is mandatory and identifies the relation row to delete."
    ]
  },
  {
    "entity": "Client Sku Region",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-region-upsert.xlsx",
    "fileName": "bulk-client-sku-region-upsert.xlsx",
    "goal": "Create or update an association of client SKUs (products) with a particular region. If the id field is provided, the existing entity is updated; otherwise a new one is created.",
    "mandatoryFields": [
      "clientSkuId",
      "regiontId",
      "isHero"
    ],
    "notes": [
      "Upsert by id: if id is provided it updates the existing entity, otherwise it creates a new one.",
      "Non-editable key fields: id, clientSkuId, regionId. All other fields are editable.",
      "msrpValue and msrpCurrency are composite: provide both or neither is saved (e.g. msrpValue 7 + msrpCurrency EUR).",
      "msrpCurrency is an Enum (e.g. EUR); msrpValue is a Float.",
      "Optional fields: id (UUID), msrpValue, msrpCurrency, businessUnitId (UUID), clientCategoryId (UUID), activeFrom (Date), activeTo (Date).",
      "isHero is a mandatory Boolean (e.g. FALSE)."
    ]
  },
  {
    "entity": "Client Sku Region",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-sku-region-delete.xlsx",
    "fileName": "bulk-client-sku-region-delete.xlsx",
    "goal": "Delete a clientSkuRegion entity via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Single field: id — the id of the clientSkuRegion entity on the client_sku_region table of the product_api database.",
      "id is the only mandatory field and the only field documented for this delete operation.",
      "No callouts, per-type requirements, or limitations are noted on the page."
    ]
  },
  {
    "entity": "Competitor Sku",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-competitor-sku-upsert.xlsx",
    "fileName": "bulk-competitor-sku-upsert.xlsx",
    "goal": "Create or update competitor SKUs (competitor products) for a specific client and brand in a particular country.",
    "mandatoryFields": [
      "countryCode",
      "clientId",
      "isHero"
    ],
    "notes": [
      "If 'id' is provided the process updates the existing entity; if omitted, it creates a new one.",
      "Closely resembles the Upsert Client Sku process, but fewer fields are mandatory since clients provide less info on competitor products.",
      "All fields except 'id' are editable (product details change frequently); 'id' is non-editable.",
      "msrp and volume are composite: you must provide both parts or neither is saved (e.g. msrpValue 7 AND msrpCurrency 'EUR').",
      "'codes' is a JSON field (e.g. {\"sku_code\":\"ax123d\"}); key-value pairs with empty or null values are ignored."
    ]
  },
  {
    "entity": "Competitor Sku",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-competitor-sku-delete.xlsx",
    "fileName": "bulk-competitor-sku-delete.xlsx",
    "goal": "Delete a competitorSku via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The 'id' field is the id of the competitorSku entity on the competitor_sku table of the product_api database.",
      "Only one field is documented (id), which is also the sole mandatory field.",
      "This is a deletion operation, so rows reference existing competitorSku records by id."
    ]
  },
  {
    "entity": "Sku Retailer Text Reference",
    "action": "Create",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-sku-retailer-text-reference-create.xlsx",
    "fileName": "bulk-sku-retailer-text-reference-create.xlsx",
    "goal": "Create a skuRetailerTextReference for a specific clientSku (product) and retailer in a particular locale and on a given date.",
    "mandatoryFields": [
      "clientSkuId",
      "retailerId",
      "localeCode",
      "date",
      "textReference.title"
    ],
    "notes": [
      "Essentially the same as Upsert Sku Text Reference, except this process also requires a retailerId.",
      "Because it is a relationship between two entities, it cannot be updated directly; to change it, delete the existing relation and create a new correct one.",
      "All fields are non-editable.",
      "date must be formatted YYYY-MM-DD (e.g. 2026-04-25).",
      "Array fields (textReference.bulletPoints, titleKeywords, descriptionKeywords, ingredients, nutrients) must be formatted as quoted, comma-separated values.",
      "Optional fields: textReference.description, bulletPoints, titleKeywords, descriptionKeywords, ingredients, nutrients."
    ]
  },
  {
    "entity": "Sku RPC",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-sku-rpc-upsert.xlsx",
    "fileName": "bulk-sku-rpc-upsert.xlsx",
    "goal": "Create or update a skuRpc for a specific SKU in a particular store.",
    "mandatoryFields": [
      "skuId",
      "storeId",
      "rpc"
    ],
    "notes": [
      "Upsert by id: if the id field is provided, the existing entity is updated; if omitted, a new one is created.",
      "id is an optional UUID and is non-editable.",
      "skuId (UUID), storeId (UUID), and rpc (Text) are all mandatory and editable.",
      "rpc is the only free-text field; the rest are UUID references."
    ]
  },
  {
    "entity": "Sku Text Reference",
    "action": "Create",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-sku-text-reference-create.xlsx",
    "fileName": "bulk-sku-text-reference-create.xlsx",
    "goal": "Create a skuTextReference for a specific clientSku (product) in a given locale and on a particular date.",
    "mandatoryFields": [
      "clientSkuId",
      "localeCode",
      "date",
      "textReference.title"
    ],
    "notes": [
      "Same as Upsert Sku Retailer Text Reference, except this process does not require a retailerId.",
      "As a relationship between two entities, it cannot be updated directly: delete the existing relation and create a new correct one.",
      "All fields are non-editable.",
      "date must be formatted YYYY-MM-DD (e.g., 2026-04-25).",
      "Array fields (textReference.bulletPoints, titleKeywords, descriptionKeywords, ingredients, nutrients) must be formatted as quoted, comma-separated values.",
      "Optional fields: textReference.description plus the five array fields above."
    ]
  },
  {
    "entity": "Store Sku",
    "action": "Upsert",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-store-sku-upsert.xlsx",
    "fileName": "bulk-store-sku-upsert.xlsx",
    "goal": "Create or update storeSkus via bulk import. If the id field is provided, the process updates the existing storeSku; otherwise it tries to create a new one, falling back to an update if a duplicate exception occurs.",
    "mandatoryFields": [
      "skuId",
      "storeId",
      "discoveryKey",
      "matchingType"
    ],
    "notes": [
      "id is optional and non-editable (UUID); when supplied, the matching storeSku is updated directly.",
      "storeId and discoveryKey are non-editable because they are used to calculate the hash that uniquely identifies the storeSku.",
      "A duplicate exception occurs when either the hash from storeId + discoveryKey matches an existing entity, or storeId + skuId match an existing active storeSku; in that case the existing storeSku is updated.",
      "matchingType is an Enum: MANUAL (manual) or AUTOMATIC (automatic).",
      "A separate process exists to activate existing storeSkus or create new active ones while deactivating old ones."
    ]
  },
  {
    "entity": "Store Sku",
    "action": "Rematch (DK Change)",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-store-sku-rematch.xlsx",
    "fileName": "bulk-store-sku-rematch.xlsx",
    "goal": "Activate existing storeSkus or create new active ones while deactivating old ones.",
    "mandatoryFields": [
      "skuId",
      "storeId",
      "discoveryKey",
      "matchingType"
    ],
    "notes": [
      "Matching first attempts to find an existing storeSku by the hash computed from storeId + discoveryKey.",
      "If found by hash: it locates the current active storeSku matching storeId + skuId, deactivates it, and activates the found one (updating values from input).",
      "Only one storeSku per storeId + skuId can be active at a time, though multiple may share the same pair.",
      "matchingType is updated when reactivating the found storeSku; it must be MANUAL or AUTOMATIC.",
      "If no storeSku matches the hash, a new one is created; a duplicate storeId + skuId triggers deactivation of the existing one and creation of a new active one.",
      "All four mandatory fields are non-editable; skuId and storeId are UUIDs, discoveryKey is Text. A separate bulk process exists to update the skuId field."
    ]
  },
  {
    "entity": "Store Sku",
    "action": "Delete",
    "group": "Product",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-store-sku-delete.xlsx",
    "fileName": "bulk-store-sku-delete.xlsx",
    "goal": "Delete a storeSku via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The 'id' field is the id of the storeSku entity on the store_sku table of the product_api database.",
      "Only one field is documented (id), which is both the sole field and the mandatory field for this delete operation."
    ]
  },
  {
    "entity": "Attribute Option & Regular Expression",
    "action": "Upsert",
    "group": "Codification",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-attribute-options-regular-expression-upsert.xlsx",
    "fileName": "bulk-attribute-options-regular-expression-upsert.xlsx",
    "goal": "Create or update attribute options and their associated regular expressions. Each line is processed sequentially, handling both the attributeOption and its regular expression.",
    "mandatoryFields": [
      "attributeId",
      "attributeOptionName",
      "regularExpression",
      "isNegative"
    ],
    "notes": [
      "If attributeOptionId is not provided, the process first tries to create a new attributeOption; on a duplicate exception it retrieves the existing one by its key fields (name + attributeId) and updates it.",
      "If no matching attributeOption is found during fallback lookup, it throws 'Not enough unique arguments to find attributeOption' and no data is updated.",
      "If attributeOptionId is provided, the existing attributeOption is updated directly with the supplied fields.",
      "The same create-or-update logic applies to attributeOptionRegularExpression using its own Id and fields.",
      "Non-editable (key/identifier) fields: attributeOptionId, attributeId, attributeOptionRegularExpressionId. Editable fields: attributeOptionName, regularExpression, isNegative.",
      "attributeOptionId and attributeOptionRegularExpressionId are optional UUIDs; isNegative is Boolean."
    ]
  },
  {
    "entity": "Brand",
    "action": "Upsert",
    "group": "Codification",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-brands-upsert.xlsx",
    "fileName": "bulk-brands-upsert.xlsx",
    "goal": "Create or update brands in bulk. Each line is processed sequentially, either creating new brands or updating existing ones.",
    "mandatoryFields": [
      "name",
      "defaultCategoryId",
      "defaultManufacturerId",
      "defaultManufacturerName"
    ],
    "notes": [
      "Upsert logic: if no 'id' is given, it tries to create; on a duplicate exception it retrieves the existing brand by its key fields (name, defaultCategoryId, defaultManufacturerId) and updates non-key fields. If none is found it throws 'Not enough unique arguments to find brand' and updates nothing.",
      "If 'id' is provided, the process updates the existing brand with the supplied field values.",
      "'name' must be unique. 'id' is optional and non-editable (UUID).",
      "Manufacturer is conditionally mandatory: provide 'defaultManufacturerId' if the manufacturer already exists, or 'defaultManufacturerName' only to create a new manufacturer.",
      "To create a regular expression for a brand you MUST fill both 'regularExpression' and 'isNegative'. Each regular expression for the same brand must be on a separate row.",
      "Optional editable fields: parentId (UUID of a parent brand), isWhiteLabel, isMultiBrand, regularExpression, isNegative."
    ]
  },
  {
    "entity": "Brand",
    "action": "Delete",
    "group": "Codification",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-brands-delete.xlsx",
    "fileName": "bulk-brands-delete.xlsx",
    "goal": "Eliminate any unused brand via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The id field is the id of this entity on the brands table of the codification_api database.",
      "id is the only field, and it is mandatory.",
      "This method deletes brands; intended only for unused brands."
    ]
  },
  {
    "entity": "Brand Category",
    "action": "Delete",
    "group": "Codification",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-brand-categories-delete.xlsx",
    "fileName": "bulk-brand-categories-delete.xlsx",
    "goal": "Eliminate any unused brand category via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Only field is 'id': the id of this entity on the brand_category table of the codification_api database.",
      "'id' is mandatory.",
      "Intended for removing brand categories that are no longer in use.",
      "No additional callouts, per-type requirements, or limitations are documented on the page."
    ]
  },
  {
    "entity": "Brand Category Regular Expression",
    "action": "Upsert",
    "group": "Codification",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-brand-category-regular-expressions-upsert.xlsx",
    "fileName": "bulk-brand-category-regular-expressions-upsert.xlsx",
    "goal": "Create or update brand category regular expressions in bulk. Each line is processed sequentially, either creating a new entry or updating an existing one.",
    "mandatoryFields": [
      "brandId",
      "categoryId",
      "regularExpression",
      "isNegative"
    ],
    "notes": [
      "If no `id` is provided, the process first tries to create; on a duplicate exception it retrieves the existing record by its key fields (`brandCategoryId` and `regularExpression`) and updates the non-key fields.",
      "If lookup by key fields finds nothing, it throws \"Not enough unique arguments to find brand category regular expression\" and no data is updated.",
      "If an `id` is provided, the process updates the existing record with the supplied field values.",
      "`brandCategoryId` is conditionally mandatory: if left empty, both `brandId` and `categoryId` become mandatory so the relation can be created.",
      "`id` is optional and non-editable (UUID); all other fields are editable.",
      "Data types: `id`/`brandCategoryId`/`brandId`/`categoryId` are UUID, `regularExpression` is String, `isNegative` is Boolean."
    ]
  },
  {
    "entity": "Brand Regular Expression",
    "action": "Delete",
    "group": "Codification",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-brand-regular-expressions-delete.xlsx",
    "fileName": "bulk-brand-regular-expressions-delete.xlsx",
    "goal": "Eliminate any unused brand regular expression via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Single field: id, which is the id of the entity on the brand_regular_expression table of the codification_api database.",
      "id is the only mandatory field.",
      "Delete action: rows identify existing brand regular expressions to remove."
    ]
  },
  {
    "entity": "Manufacturer",
    "action": "Upsert",
    "group": "Codification",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-manufacturers-upsert.xlsx",
    "fileName": "bulk-manufacturers-upsert.xlsx",
    "goal": "Create or update manufacturers in bulk. Each row is processed sequentially: rows without an id are created (or, on a duplicate, matched by key and updated); rows with an id update the existing manufacturer.",
    "mandatoryFields": [
      "name"
    ],
    "notes": [
      "Processing is sequential, one line at a time.",
      "No id provided: first attempts to create; on a duplicate exception it retrieves the existing record by its key field (name) and updates it.",
      "Key field for matching is name.",
      "If no record can be found by key, it throws 'Not enough unique arguments to find project' and no data is updated.",
      "id provided: directly updates the existing record with the supplied fields.",
      "id is an optional, non-editable UUID; name is editable Text and must be unique."
    ]
  },
  {
    "entity": "Client Project",
    "action": "Delete",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-project-delete.xlsx",
    "fileName": "bulk-client-project-delete.xlsx",
    "goal": "Delete a client-project relation via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Only one field is used: id.",
      "id refers to the id of the clientProject entity on the client_project table of the visualization_api database.",
      "Action is Delete, so the row identifies an existing relation to remove (not create/update)."
    ]
  },
  {
    "entity": "Client Project Job",
    "action": "Upsert",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-client-project-job-upsert.xlsx",
    "fileName": "bulk-client-project-job-upsert.xlsx",
    "goal": "Create or update jobs and their relations necessary for handling seeds and other important entities.",
    "mandatoryFields": [
      "name",
      "storeId",
      "extractionType",
      "geolocMode",
      "definitionMethod",
      "extractReviews",
      "extractMarketplace"
    ],
    "notes": [
      "Upsert by id: if id (UUID, non-editable) is provided the process updates the existing entity; if omitted it creates a new one.",
      "If locationId, timeframeIds, boxIds or projectName are provided, new values are appended to existing entities rather than overwriting; left empty means no association is created. Deleting locations/timeframes/boxes requires the console.",
      "boxIds and timeframeIds accept a UUID or array of UUIDs, formatted as quoted, comma-separated values.",
      "Enum constraints: extractionType = SEARCH/SHELF/AD/DIGITAL_SHELF_PDP/DIGITAL_SHELF_PLP/MEDIA; geolocMode = NO_GEOLOC/MANUAL/AUTOMATIC/VIRTUAL_STORE; definitionMethod = BOX/SEED; status = ACTIVE/INACTIVE (defaults to ACTIVE).",
      "projectName creates a new project (or reuses an existing one by that name); clientId is required when creating a project via projectName. activeFrom defaults to current date if blank; activeTo sets the project's active-period end.",
      "businessUnit (enum CMI/FSA/DSM/RMM/MSH/GEN) is not implemented yet. storeId and extractionType are non-editable."
    ]
  },
  {
    "entity": "Job Location",
    "action": "Delete",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-job-location-delete.xlsx",
    "fileName": "bulk-job-location-delete.xlsx",
    "goal": "Delete a jobLocation relation via bulk import.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "Single field required: id.",
      "id is the identifier of the jobLocation entity on the job_location table of the ecometry_tasks_api database.",
      "Operation deletes the jobLocation relation."
    ]
  },
  {
    "entity": "Job Seed",
    "action": "Upsert",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-jobs-with-seeds-upsert.xlsx",
    "fileName": "bulk-jobs-with-seeds-upsert.xlsx",
    "goal": "Create or update the relationship between a specific seed and a determined job. The bulk file must contain both id pairs (seed and job) to establish the relationship between them.",
    "mandatoryFields": [
      "seedId",
      "jobId"
    ],
    "notes": [
      "seedId is mandatory, non-editable, and of data type UUID.",
      "jobId is mandatory, non-editable, and of data type UUID.",
      "Each row must include both seedId and jobId to define the seed-to-job relationship.",
      "Both fields are non-editable, so this method links existing seed and job records rather than modifying their attributes.",
      "Action is Upsert: creates the relation if it does not exist, otherwise updates it."
    ]
  },
  {
    "entity": "Job Seed",
    "action": "Delete",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-jobs-with-seeds-delete.xlsx",
    "fileName": "bulk-jobs-with-seeds-delete.xlsx",
    "goal": "Delete the relation between a specific seed and a determined job.",
    "mandatoryFields": [
      "id"
    ],
    "notes": [
      "The bulk file must contain the id of the relationship between seed and job.",
      "id is the relationship identifier, data type UUID.",
      "id is mandatory and non-editable.",
      "This method deletes the job-seed relation only (not the underlying job or seed)."
    ]
  },
  {
    "entity": "Order",
    "action": "Upsert",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-orders-upsert.xlsx",
    "fileName": "bulk-orders-upsert.xlsx",
    "goal": "Create or update orders in bulk. Each line is processed sequentially, either creating a new order or updating an existing one.",
    "mandatoryFields": [
      "name",
      "storeId",
      "projectId",
      "environmentVariables.machineSize.size",
      "environmentVariables.parallelism",
      "scheduling.minutes",
      "scheduling.hours",
      "scheduling.monthDays",
      "scheduling.months",
      "scheduling.weekDays",
      "inputsInstructions.type",
      "deliveryMethod.type"
    ],
    "notes": [
      "Upsert logic: with no id, tries to create; on duplicate it retrieves the existing order by key fields (storeId, projectId, name) and updates non-key fields. If none found, throws 'Not enough unique arguments to find order'. If id is provided, it updates that order directly.",
      "id is optional and non-editable (UUID); name must be unique.",
      "Constrained value fields: machineSize.size (XXS, XS, S, M, L, XL, XXL, Boost); parallelism 1-5; scheduling minutes 0-59, hours 0-23, monthDays 1-31, months 1-12; weekDays use SUN/MON/TUE/WED/THU/FRI/SAT.",
      "deliveryMethod.type accepts none, s3, rabbitmq, firehose. Each type adds mandatory attributes: s3 -> bucket + folder; firehose -> streamName (enum); rabbitmq -> exchange + key.",
      "inputsInstructions.type drives extra fields. Most ecometry* types require inputsInstructions.attributes.timeframeId (UUID); SnowflakeImageDownload requires downloadStatus instead.",
      "reExecutionRules fields (retries [1-5], nextTriggerDelayMinutes [0/15/30/45/60], errorCategories [DATA_COLLECTOR_ERROR, SEED_ERROR, CONNECTION_ERROR, TEMPLATE_ERROR]) are optional, but if reExecutionRules is used all three become mandatory together."
    ]
  },
  {
    "entity": "Seed",
    "action": "Upsert",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-seed-upsert.xlsx",
    "fileName": "bulk-seed-upsert.xlsx",
    "goal": "Create or update seeds and assign them to their corresponding jobs, boxes, and timeframes when provided. Each line is processed sequentially.",
    "mandatoryFields": [
      "storeId",
      "description",
      "categoryId",
      "isQaCandidate",
      "seedType.key"
    ],
    "notes": [
      "Upsert logic: if no seedId, attempts create; on duplicate exception it retrieves the existing seed by key fields (storeId, seedType.key, plus the seed type's specific fields) and updates non-key fields; if none found it throws 'Not enough unique arguments to find seed' and updates nothing. If seedId is provided, it updates that seed.",
      "Limitation: API seeds (e.g. AD_API, SHELF_API) cannot be retrieved to update non-key fields because the apiOrigin JSON content is not searchable.",
      "Associations: jobIds links the seed to jobs (must share the same storeId, quoted comma-separated), boxIds links to boxes, timeframeId links to a timeframe. seedType.attributes.destination.jobIds adds new destination jobs without removing existing ones.",
      "Brand: brandId (valid brand UUID) is only supported for seed types AD_KEYWORD, SEARCH_KEYWORD, MEDIA_KEYWORD, and DIGITAL_SHELF_PLP_KEYWORD.",
      "seedType.key enum: AD_KEYWORD, AD_URL, AD_API, SEARCH_KEYWORD, SHELF_URL, SHELF_API, DIGITAL_SHELF_PLP_KEYWORD, DIGITAL_SHELF_PLP_URL, DIGITAL_SHELF_PLP_API, DIGITAL_SHELF_PDP_URL, DIGITAL_SHELP_PDP_API, MEDIA_URL, MEDIA_KEYWORD, MEDIA_API. Each type requires extra mandatory seedType.attributes.* fields (e.g. keyword/keywordType, url/pageType, apiOrigin, maxPages/maxRank, destination.jobIds/extractionType, discoveryKey/isFromDiscovery/currentLocationId).",
      "Non-editable fields: seedId, storeId, seedType.key. A separate bulk process exists for creating/assigning seeds with tags simultaneously."
    ]
  },
  {
    "entity": "Seed with tags",
    "action": "Upsert",
    "group": "Tasks & Seeds",
    "fileUrl": "https://prod-bulk-api-examples.v2.shalion.com/bulk-seed-with-tags-upsert.xlsx",
    "fileName": "bulk-seed-with-tags-upsert.xlsx",
    "goal": "Create or update seeds and assign them to their corresponding jobs, boxes, timeframes and client seed tags. Same as the standard upsert seed process, but enforces creating seeds with tags simultaneously by making clientId and tags mandatory.",
    "mandatoryFields": [
      "storeId",
      "description",
      "categoryId",
      "isQaCandidate",
      "seedType.key",
      "clientId",
      "tags"
    ],
    "notes": [
      "Only for seeds that require tags: if tags aren't needed, use the standard upsert seed process instead or it will error. clientId and tags are mandatory here precisely to enforce correct tag creation.",
      "Upsert-by-key: if no seedId is given, it tries to create; on duplicate it retrieves the existing seed via key fields (storeId, seedType.key, and the seed type's specific fields) and updates non-key fields. If none found, throws 'Not enough unique arguments to find seed' and updates nothing.",
      "Limitation: API seeds (e.g. AD_API, SHELF_API) cannot be retrieved to update non-key fields because the JSON in apiOrigin is not searchable.",
      "Non-editable (key) fields: seedId, storeId, seedType.key, clientId, tags. Providing jobIds/boxIds associates the seed with those jobs/boxes; destination jobIds are added without removing existing ones; tags are added without removing existing ones.",
      "Per-type extra mandatory fields under seedType.attributes by seedType.key, e.g. AD_KEYWORD/MEDIA_KEYWORD/SEARCH_KEYWORD: keyword (+ keywordType); URL types: url (+ pageType); API types: apiOrigin (+ pageType); SHELF/SEARCH add maxPages & maxRank; DIGITAL_SHELF_PLP/MEDIA types add destination.jobIds & destination.extractionType; DIGITAL_SHELF_PDP_URL/API: discoveryKey, isFromDiscovery, currentLocationId.",
      "jobIds and destination.jobIds must share the same storeId as the seed and be formatted as quoted, comma-separated values."
    ]
  }
];
