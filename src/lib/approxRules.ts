// AUTO-GENERATED business-rule pages for the promoted entities (rules mined from console-frontend).
import type { RulePage } from "./businessRules";

export const APPROX_RULE_PAGES: Record<string, RulePage> = {
  "manufacturers": {
    "key": "manufacturers",
    "label": "Manufacturers",
    "match": "/codification/manufacturers",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Manufacturer name is required and must not be empty."
        ]
      },
      {
        "category": "Data Entry",
        "rules": [
          "Name field accepts autocomplete suggestions from existing manufacturers in the system."
        ]
      },
      {
        "category": "Relationships",
        "rules": [
          "A manufacturer can have multiple brands associated with it, visible in a separate section of the detail page."
        ]
      },
      {
        "category": "Delete Protection",
        "rules": [
          "A manufacturer can only be deleted if no dependencies prevent removal; deletion navigates the user back to the manufacturers list."
        ]
      },
      {
        "category": "Audit",
        "rules": [
          "Creation and modification timestamps are automatically tracked and displayed in the list view."
        ]
      },
      {
        "category": "Unique Identification",
        "rules": [
          "Each manufacturer has a system-assigned unique ID that cannot be edited and can be copied to clipboard."
        ]
      },
      {
        "category": "Validation",
        "rules": [
          "Name input is trimmed of whitespace before validation to ensure clean data storage."
        ]
      }
    ]
  },
  "promotions": {
    "key": "promotions",
    "label": "Promotions",
    "match": "/codification/promotions",
    "groups": [
      {
        "category": "Name",
        "rules": [
          "Name is required and must be between 1 and 50 characters long."
        ]
      },
      {
        "category": "Promo Code",
        "rules": [
          "Promo code is optional and accepts any string value."
        ]
      },
      {
        "category": "Promotion Group",
        "rules": [
          "Promotion group is optional and must be one of the predefined promotion types (Base, Bundle, Discount, Gift, Loyalty, Recurring, or Volume)."
        ]
      },
      {
        "category": "Regular Expressions",
        "rules": [
          "After promotion is created, regex patterns can be added to classify the promotion for all but manual value propositions."
        ]
      },
      {
        "category": "Deletion",
        "rules": [
          "A promotion can be deleted at any time via the delete action in the header, with confirmation required."
        ]
      },
      {
        "category": "Uniqueness",
        "rules": [
          "Promotions appear to be identified by auto-generated IDs; name uniqueness is not enforced at the form level."
        ]
      }
    ]
  },
  "listings": {
    "key": "listings",
    "label": "All listings",
    "match": "/codification/listings",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Brand selection is mandatory for both create and update operations."
        ]
      },
      {
        "category": "Field Dependencies",
        "rules": [
          "Category field only appears and remains enabled if a Brand is selected. Category options are filtered by the selected Brand."
        ]
      },
      {
        "category": "Category Behavior",
        "rules": [
          "Category selection is optional. When no category is selected during update, any existing category association is cleared."
        ]
      },
      {
        "category": "Display Information",
        "rules": [
          "The Default Category field displays as read-only text showing the selected Brand's default category (not editable by user)."
        ]
      },
      {
        "category": "Bulk Operations",
        "rules": [
          "Multiple listings can be created or updated together with the same Brand and Category values."
        ]
      },
      {
        "category": "Brand Resolution",
        "rules": [
          "Brand must be a valid existing Brand resource with an ID that exists in the system."
        ]
      },
      {
        "category": "Category Resolution",
        "rules": [
          "Category, if selected, must be a valid BrandCategory resource belonging to the chosen Brand."
        ]
      },
      {
        "category": "Data Persistence",
        "rules": [
          "Create operations establish new listings with the selected Brand and optional Category. Update operations modify existing listing associations without affecting other listing properties."
        ]
      }
    ]
  },
  "fsa-listings": {
    "key": "fsa-listings",
    "label": "FSA listings",
    "match": "/codification/fsa-listings",
    "groups": [
      {
        "category": "Feature Status",
        "rules": [
          "FSA Listings feature is read-only with no create/edit form component"
        ]
      },
      {
        "category": "Available Components",
        "rules": [
          "Feature contains only listing, filtering, and export functionality"
        ]
      },
      {
        "category": "Data Source",
        "rules": [
          "FSA Listings are fetched from external Snowflake API and displayed in read-only data grid"
        ]
      }
    ]
  },
  "ads": {
    "key": "ads",
    "label": "All ads",
    "match": "/codification/ads",
    "groups": [
      {
        "category": "Field Requirements",
        "rules": [
          "Brand is required — an ad categorization cannot be created without selecting a brand",
          "Promotion is required — an ad categorization must have a promotion assigned",
          "Category is optional — a categorization can exist without a category if only brand and promotion are selected"
        ]
      },
      {
        "category": "Field Dependencies",
        "rules": [
          "Category options are dependent on the selected Brand — when a brand is changed, the category field resets and shows only categories valid for the new brand"
        ]
      },
      {
        "category": "Array Behavior",
        "rules": [
          "Multiple ad categorizations can be added in a single form submission — users can add or remove categorization rows using the Add/Remove buttons"
        ]
      },
      {
        "category": "Data Composition",
        "rules": [
          "When creating ads, categorizations are packaged with ad metadata (retailer ID, image URL, OCR text) and submitted together as a single atomic operation"
        ]
      },
      {
        "category": "Delete Guards",
        "rules": [
          "Ad categorizations can be deleted individually — each categorization row includes a delete icon that removes only that specific categorization"
        ]
      },
      {
        "category": "Validation",
        "rules": [
          "At least one complete categorization (brand + promotion) must be present to submit the form — empty or partially-filled rows will trigger validation errors"
        ]
      }
    ]
  },
  "fsa-sections": {
    "key": "fsa-sections",
    "label": "FSA sections",
    "match": "/codification/fsa-sections",
    "groups": [
      {
        "category": "Required fields",
        "rules": [
          "Name must be provided and cannot be empty."
        ]
      },
      {
        "category": "Data format",
        "rules": [
          "Name is stored as a trimmed string to prevent leading/trailing whitespace."
        ]
      },
      {
        "category": "State management",
        "rules": [
          "FSA sections are read-only once created; the form shows edit capability, but the name is the only editable field and is immutable after initial creation."
        ]
      },
      {
        "category": "List columns",
        "rules": [
          "The FSA section name appears as the primary display column in the data grid and is sortable/filterable by search parameters."
        ]
      }
    ]
  },
  "value-propositions": {
    "key": "value-propositions",
    "label": "Value propositions",
    "match": "/codification/value-propositions",
    "groups": [
      {
        "category": "Validation",
        "rules": [
          "Promotion selection is mandatory and must not be empty"
        ]
      },
      {
        "category": "Scope",
        "rules": [
          "Creating value propositions applies the selected promotion to all rows currently selected in the data grid"
        ]
      },
      {
        "category": "Data Mapping",
        "rules": [
          "Each selected row generates one new value proposition with its text, the associated retailer ID, and the selected promotion ID"
        ]
      },
      {
        "category": "Operation",
        "rules": [
          "Creation is a batch operation; results display individual success or failure status for each generated value proposition"
        ]
      },
      {
        "category": "Context",
        "rules": [
          "Modal only appears after user selects one or more value propositions from the All Value Propositions grid"
        ]
      },
      {
        "category": "Autocomplete",
        "rules": [
          "Promotion field uses dynamic search to fetch available promotions from the promotion index rather than static options"
        ]
      }
    ]
  },
  "attributes": {
    "key": "attributes",
    "label": "Attributes",
    "match": "/codification/attributes",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Name, Type, and Data Variable are mandatory for creating or updating an attribute"
        ]
      },
      {
        "category": "Type Dependency",
        "rules": [
          "The Data Variable field is dependent on Type selection; it filters available variables by the chosen type and resets when type changes"
        ]
      },
      {
        "category": "Input Validation",
        "rules": [
          "Name must be non-empty after whitespace trimming; Input Filters must not exceed 2000 characters"
        ]
      },
      {
        "category": "Optional Configuration",
        "rules": [
          "Multiple (checkbox) and Input Filters (textarea) are optional; Multiple defaults to false if not specified"
        ]
      },
      {
        "category": "Input Filters Responsibility",
        "rules": [
          "Input Filters field accepts raw Snowflake query parameters without any filtering, validation, or transformation by the system"
        ]
      },
      {
        "category": "Attribute Options",
        "rules": [
          "Options can only be added after the parent attribute is persisted; each option requires a unique name"
        ]
      },
      {
        "category": "Delete Protection",
        "rules": [
          "Deleting an attribute or option requires explicit confirmation; deletion cascades to remove all related data"
        ]
      },
      {
        "category": "Form Workflow",
        "rules": [
          "Full attribute configuration including options and related attributes is completed through a multi-card detail page with tabbed sections"
        ]
      }
    ]
  },
  "data-variables": {
    "key": "data-variables",
    "label": "Data variables",
    "match": "/codification/data-variables",
    "groups": [
      {
        "category": "Identity",
        "rules": [
          "Each data variable must have a unique name that identifies it within the system."
        ]
      },
      {
        "category": "Required Fields",
        "rules": [
          "Both name and type are required; neither can be empty or null."
        ]
      },
      {
        "category": "Type",
        "rules": [
          "Type must be selected from a predefined enumeration of valid data types (STRING, NUMERIC, BOOLEAN, ENUMERATION, DECIMAL, INTEGER)."
        ]
      },
      {
        "category": "Immutability",
        "rules": [
          "Once created, a data variable's type cannot be changed; type selection is disabled when editing an existing record."
        ]
      },
      {
        "category": "Delete Guards",
        "rules": [
          "A data variable cannot be deleted if it is currently referenced by attributes or other dependent entities."
        ]
      }
    ]
  },
  "business-units": {
    "key": "business-units",
    "label": "Business units",
    "match": "/product/business-units",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Name field is required and must not be empty or contain only whitespace",
          "Client must be selected from the available clients list"
        ]
      },
      {
        "category": "Data Integrity",
        "rules": [
          "Name must be unique within the system (validated via autocomplete searchExistentBusinessUnits)"
        ]
      },
      {
        "category": "Relationships",
        "rules": [
          "Each business unit must be associated with exactly one client"
        ]
      },
      {
        "category": "Operations",
        "rules": [
          "Creating a new business unit requires name and client selection; both are persisted in a single request",
          "Editing a business unit allows updating name and client association independently"
        ]
      },
      {
        "category": "Delete Guard",
        "rules": [
          "Business units can be deleted individually or in batch; deletion confirmation is required before proceeding"
        ]
      },
      {
        "category": "Audit Trail",
        "rules": [
          "System automatically tracks createdAt and updatedAt timestamps; these are read-only and not editable"
        ]
      }
    ]
  },
  "client-categories": {
    "key": "client-categories",
    "label": "Client categories",
    "match": "/product/client-categories",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Name must be provided and cannot be empty after trimming whitespace",
          "Client selection is mandatory and cannot be null"
        ]
      },
      {
        "category": "Name Field",
        "rules": [
          "Name field is assisted input with autocomplete, suggesting existing client category names to prevent duplicates"
        ]
      },
      {
        "category": "Client Selection",
        "rules": [
          "Client is a required autocomplete field that fetches available clients from the backoffice API"
        ]
      },
      {
        "category": "Data Mapping",
        "rules": [
          "When creating or updating, the client field value is mapped to clientId in the API request body"
        ]
      },
      {
        "category": "Form Persistence",
        "rules": [
          "On successful creation, user is redirected to the detail page for the newly created client category"
        ]
      },
      {
        "category": "Audit Fields",
        "rules": [
          "Created and updated timestamps are automatically managed by the API and displayed in the data grid but not editable in the form"
        ]
      },
      {
        "category": "Delete Guards",
        "rules": [
          "Client categories can be deleted individually or in batch, with a confirmation dialog displayed before deletion"
        ]
      }
    ]
  },
  "store-skus": {
    "key": "store-skus",
    "label": "Store skus",
    "match": "/product/store-skus",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Store, SKU ID, Discovery key, and Matching type must all be provided when creating or editing a store SKU."
        ]
      },
      {
        "category": "Discovery Key",
        "rules": [
          "Discovery key must be a non-empty string after trimming whitespace."
        ]
      },
      {
        "category": "Matching Type",
        "rules": [
          "Matching type must be either Manual or Assisted; it defaults to Manual when creating a new store SKU."
        ]
      },
      {
        "category": "Store Selection",
        "rules": [
          "A valid store must be selected from the available stores autocomplete list."
        ]
      },
      {
        "category": "SKU Selection",
        "rules": [
          "A valid SKU must be selected from the available SKUs autocomplete list."
        ]
      },
      {
        "category": "Status",
        "rules": [
          "Store SKUs have an isActive status field that controls whether they appear in searches and operations; this is managed separately from the main form via the status switch component."
        ]
      },
      {
        "category": "Deletion",
        "rules": [
          "Store SKUs can be deleted individually from the detail page; deletion triggers invalidation of the store-skus list cache."
        ]
      },
      {
        "category": "Audit Fields",
        "rules": [
          "Each store SKU record includes read-only id, createdAt, and updatedAt fields that are managed by the system."
        ]
      }
    ]
  },
  "sku-rpcs": {
    "key": "sku-rpcs",
    "label": "Sku rpcs",
    "match": "/product/sku-rpcs",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Rpc, Store, and Sku id must all be provided before saving."
        ]
      },
      {
        "category": "Rpc Field",
        "rules": [
          "Rpc field must be a non-empty string (whitespace trimmed). The system assists with autocomplete suggestions from existing Rpc values."
        ]
      },
      {
        "category": "Store Selection",
        "rules": [
          "Store must be selected from the available stores autocomplete list."
        ]
      },
      {
        "category": "Sku Selection",
        "rules": [
          "Sku id must be selected from the available SKU autocomplete list."
        ]
      },
      {
        "category": "Creation vs Update",
        "rules": [
          "New Sku RPC records require all three fields. Existing records can be updated with changes to any field."
        ]
      }
    ]
  },
  "assortments": {
    "key": "assortments",
    "label": "Assortments",
    "match": "/product/assortments",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Client and Store are required and must be selected before saving"
        ]
      },
      {
        "category": "Date Validation",
        "rules": [
          "If both Active from and Active to dates are provided, Active to must be after Active from"
        ]
      },
      {
        "category": "Immutability",
        "rules": [
          "Client and Store fields become read-only once the assortment is created and cannot be changed during edit"
        ]
      },
      {
        "category": "Automatic Mode",
        "rules": [
          "When Is automatic is checked, all client SKUs are included by default and manual client SKU assignment is disabled"
        ]
      },
      {
        "category": "Multi Matching",
        "rules": [
          "Is multi matching allows the same assortment to be assigned to multiple store entries for the same client; when unchecked enforces one-store-per-client restriction"
        ]
      },
      {
        "category": "Delete Guard",
        "rules": [
          "An assortment can only be deleted if it has no associated client SKUs; deletion of the assortment requires all assigned client SKUs to be removed first"
        ]
      },
      {
        "category": "Region Store Variant",
        "rules": [
          "A separate Assortment Region Store form exists for managing region-specific assortments with additional Region System and Region fields plus a Mode field (Regional or National)"
        ]
      }
    ]
  },
  "sku-image-references": {
    "key": "sku-image-references",
    "label": "Sku images",
    "match": "/product/sku-image-references",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Client, Code key, at least one Country, Locale, Image upload mode, and a zip file package must all be provided to submit the form."
        ]
      },
      {
        "category": "File Upload",
        "rules": [
          "Only ZIP files are accepted for the SKU image references package. The file must contain folders named after product codes, with images inside each folder."
        ]
      },
      {
        "category": "File Structure",
        "rules": [
          "Images within folders must have their position appended with underscore before the file extension (e.g., code_1_1 for main images, code_2 for secondary images). Only JPEG and PNG formats are allowed."
        ]
      },
      {
        "category": "Country Selection",
        "rules": [
          "Multiple countries can be selected at once when uploading SKU image references to apply them across multiple regions simultaneously."
        ]
      },
      {
        "category": "Image Upload Mode - Complete",
        "rules": [
          "When Complete mode is selected, all previous active image references matching the specified filters (client, code key, countries, locale) will be inactivated and replaced with the new ones."
        ]
      },
      {
        "category": "Image Upload Mode - Partial",
        "rules": [
          "When Partial mode is selected, only image references in the same position as the new images will be deactivated; other existing references remain active."
        ]
      },
      {
        "category": "Code Key Format",
        "rules": [
          "Code key should be a standard identifier type such as EAN, SKU code, GTIN, UPC, or ASIN, but any non-empty string value is technically allowed."
        ]
      },
      {
        "category": "Upload Scope",
        "rules": [
          "The upload operation is scoped to a specific combination of client, code key, locale, and selected countries to ensure image references are applied to the correct product variants."
        ]
      }
    ]
  },
  "sku-retailer-image-references": {
    "key": "sku-retailer-image-references",
    "label": "Sku retailer image references",
    "match": "/product/sku-retailer-image-references",
    "groups": [
      {
        "category": "Selection",
        "rules": [
          "A single client must be selected; it cannot be empty.",
          "At least one retailer must be selected from the available retailers list.",
          "At least one country must be selected to define the upload scope.",
          "A locale must be selected to determine the language context for image references."
        ]
      },
      {
        "category": "Code Key",
        "rules": [
          "Code key accepts text input with suggested values including ean, sku_code, gtin, upc, or asin."
        ]
      },
      {
        "category": "Upload Mode",
        "rules": [
          "Complete mode inactivates all previous active references for the specified filters; Partial mode inactivates only references sharing the same image position."
        ]
      },
      {
        "category": "Package Format",
        "rules": [
          "The package must be a single ZIP file containing folders named by product code, with images organized by position (_1_1, _1_2, etc.) accepting only JPEG and PNG formats."
        ]
      },
      {
        "category": "Error Handling",
        "rules": [
          "Exceptions encountered during upload are reported to the user; the modal remains open to allow correction and resubmission."
        ]
      }
    ]
  },
  "sku-store-image-references": {
    "key": "sku-store-image-references",
    "label": "Sku store image references",
    "match": "/product/sku-store-image-references",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Client, at least one Store, Code Key, at least one Country, Locale, and a ZIP file package must all be provided to submit the form."
        ]
      },
      {
        "category": "File Upload",
        "rules": [
          "The SKU store image references package must be a single ZIP file; only JPEG and PNG images inside are accepted."
        ]
      },
      {
        "category": "ZIP Structure",
        "rules": [
          "The ZIP file must contain folders named by product code, with images inside named using position suffixes (_1_1 for main, _1_2 for alternate mains, _2, _3 etc. for secondary images)."
        ]
      },
      {
        "category": "Multiple Selection",
        "rules": [
          "One or more stores and one or more countries must be selected; a single client, code key, and locale are fixed for the entire upload."
        ]
      },
      {
        "category": "Image Upload Mode",
        "rules": [
          "Complete mode inactivates all previous active references matching the filters; Partial mode only inactivates references that share the same position as new images."
        ]
      },
      {
        "category": "Code Key Format",
        "rules": [
          "Code Key should typically be one of the suggested values: ean, sku_code, gtin, upc, or asin, though custom values are allowed."
        ]
      },
      {
        "category": "Processing Logic",
        "rules": [
          "Upload errors are reported to the user with a summary of failures; the modal remains open until all images are successfully processed or user chooses to cancel."
        ]
      },
      {
        "category": "Field Dependencies",
        "rules": [
          "All fields apply to the entire batch upload; each image inside the ZIP is processed with the selected client, stores, countries, locale, and upload mode."
        ]
      }
    ]
  },
  "sku-text-references": {
    "key": "sku-text-references",
    "label": "Sku text references",
    "match": "/product/sku-text-references",
    "groups": [
      {
        "category": "Required fields",
        "rules": [
          "Client SKU, date, and locale code must be provided on every text reference",
          "Title within the text reference is mandatory; description and all keyword/attribute fields are optional"
        ]
      },
      {
        "category": "Form state",
        "rules": [
          "The form becomes read-only after initial creation; editing existing text references is not permitted"
        ]
      },
      {
        "category": "Text reference purpose",
        "rules": [
          "Title serves as the ideal product reference and is algorithmically scored against retailer product titles (0-100)",
          "Description serves as the ideal product description reference and is algorithmically scored against retailer product descriptions (0-100)"
        ]
      },
      {
        "category": "Keywords and attributes",
        "rules": [
          "Title keywords are important words/phrases the client wants visible in retailer titles; missing keywords can be identified when score is below 100",
          "Description keywords are crucial words/phrases the client wants in retailer descriptions; system can identify missing keywords affecting the description score",
          "Bullet points, ingredients, and nutrients are freeform multi-value fields that clients can provide as reference attributes for product matching"
        ]
      }
    ]
  },
  "sku-retailer-text-references": {
    "key": "sku-retailer-text-references",
    "label": "Sku retailer text references",
    "match": "/product/sku-retailer-text-references",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Client SKU, Retailer, Date, Locale, and Title are mandatory for creating a SKU retailer text reference."
        ]
      },
      {
        "category": "Read-Only After Creation",
        "rules": [
          "Once created, all form fields are disabled (read-only). The reference cannot be edited, only viewed."
        ]
      },
      {
        "category": "Title & Description Scoring",
        "rules": [
          "The title is used as the ideal product reference and scored against retailer's actual title using an algorithm that produces a score from 0-100. Description follows the same scoring logic."
        ]
      },
      {
        "category": "Keywords Inference",
        "rules": [
          "Title and description keywords can be manually provided or automatically inferred from the reference title and description if not supplied."
        ]
      },
      {
        "category": "Keyword Scoring Logic",
        "rules": [
          "Keywords are used to calculate title and description scores, identifying which keywords are missing from the retailer's product listing."
        ]
      },
      {
        "category": "Locale Format",
        "rules": [
          "Locale is a required text field that specifies the language/region code for the text reference."
        ]
      },
      {
        "category": "Array Fields",
        "rules": [
          "Bullet points, keywords, ingredients, and nutrients are all multi-value fields that accept comma-separated or individually added items."
        ]
      },
      {
        "category": "Reference Data Relationship",
        "rules": [
          "Each text reference is tied to a specific Client SKU and Retailer combination on a specific date, creating a unique reference point for product comparison."
        ]
      }
    ]
  },
  "sku-store-text-references": {
    "key": "sku-store-text-references",
    "label": "Sku store text references",
    "match": "/product/sku-store-text-references",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Client SKU, Store, Date, and Locale code must be provided when creating a text reference.",
          "Text reference title is mandatory and must not be empty; it represents the ideal product title provided by the client."
        ]
      },
      {
        "category": "Text Reference Data",
        "rules": [
          "Title is used as a standard to compare with retailer product titles using a scoring algorithm (0-100). Higher score indicates closer match.",
          "Description is optional but used similarly to title for scoring retailer product descriptions when provided.",
          "Title keywords, description keywords, ingredients, and nutrients are all optional metadata that can be provided as multiple comma-separated values."
        ]
      },
      {
        "category": "Keywords & Metadata",
        "rules": [
          "Title keywords and description keywords help the scoring algorithm identify important terms that should appear in retailer product content."
        ]
      },
      {
        "category": "Read-Only Fields",
        "rules": [
          "Creation date/time, last updated date/time, created by, and last updated by are automatically managed and not editable through the form."
        ]
      },
      {
        "category": "Locale & Date",
        "rules": [
          "Locale code indicates the regional/language variant for the text reference, and date represents when the reference was established."
        ]
      }
    ]
  },
  "settings-cubes": {
    "key": "settings-cubes",
    "label": "Cubes",
    "match": "/settings/cubes",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Name must be provided and non-empty (minimum 1 character after trimming whitespace)",
          "Description must be provided and non-empty (minimum 1 character after trimming whitespace)"
        ]
      },
      {
        "category": "Field Validation",
        "rules": [
          "Both name and description fields are trimmed of leading/trailing whitespace before validation"
        ]
      },
      {
        "category": "Cube Purpose",
        "rules": [
          "A cube represents a packaged set of business data for analysis (e.g., 'Sales', 'Share of Shelf') and can be linked to a Cube.dev dashboard application"
        ]
      },
      {
        "category": "Related Entities",
        "rules": [
          "Cubes can have associated dashboard applications assigned through a separate modal dialog (CubeDashboardApplicationModal)"
        ]
      },
      {
        "category": "Operations",
        "rules": [
          "Cubes can be created, updated, or deleted; updates to cube metadata (name/description) are supported"
        ]
      },
      {
        "category": "Audit Fields",
        "rules": [
          "Cube resources include an auto-generated id field that is read-only and returned by the API"
        ]
      }
    ]
  },
  "settings-scopes": {
    "key": "settings-scopes",
    "label": "Scopes",
    "match": "/settings/scopes",
    "groups": [
      {
        "category": "Required fields",
        "rules": [
          "Scope name is required and cannot be blank or empty."
        ]
      },
      {
        "category": "Text constraints",
        "rules": [
          "Scope name must not exceed 100 characters."
        ]
      },
      {
        "category": "Uniqueness",
        "rules": [
          "Scope name must be unique across all scopes in the system."
        ]
      },
      {
        "category": "Update behavior",
        "rules": [
          "When updating, the name field can be omitted (null) to leave it unchanged; it is only validated for uniqueness if a new name is provided that differs from the current one."
        ]
      },
      {
        "category": "Delete guard",
        "rules": [
          "A scope cannot be deleted if it is already in use by a rule scope; the deletion will be rejected with a DeletionNotAllowedException."
        ]
      },
      {
        "category": "Audit fields",
        "rules": [
          "System automatically tracks creationDateTime, lastUpdatedDateTime, createdBy, and lastUpdatedBy; these are read-only and not editable via the form."
        ]
      }
    ]
  },
  "bulk": {
    "key": "bulk",
    "label": "Bulk",
    "match": "/bulk",
    "groups": [
      {
        "category": "File Requirements",
        "rules": [
          "The input file must be in XLSX format as documented in the example files."
        ]
      },
      {
        "category": "Selection Requirements",
        "rules": [
          "A process type must be selected from the autocomplete list of available ProcessTypeResource options."
        ]
      },
      {
        "category": "File Upload",
        "rules": [
          "Exactly one file must be provided; the file name is extracted and sent with the request."
        ]
      },
      {
        "category": "Processing",
        "rules": [
          "Upon successful creation, the process is created with the selected type name and file, then navigates to the bulk processes list."
        ]
      },
      {
        "category": "File Handling",
        "rules": [
          "The uploaded file is converted to a Blob using its original MIME type for submission."
        ]
      },
      {
        "category": "Notifications",
        "rules": [
          "A success notification is shown upon creation, displaying the new process ID."
        ]
      }
    ]
  },
  "tasks-projects": {
    "key": "tasks-projects",
    "label": "Projects",
    "match": "/tasks/projects",
    "groups": [
      {
        "category": "Required Fields",
        "rules": [
          "Project name is required and must be non-empty after trimming whitespace."
        ]
      },
      {
        "category": "Optional Fields",
        "rules": [
          "BoM (Bill of Material) is optional text input that can be omitted."
        ]
      },
      {
        "category": "Status Management",
        "rules": [
          "Status defaults to Active when creating new projects and can be toggled to Inactive or kept Active on updates."
        ]
      },
      {
        "category": "Status Field Availability",
        "rules": [
          "Status field is only enabled when editing an existing project (disabled during creation)."
        ]
      },
      {
        "category": "Project Creation",
        "rules": [
          "New projects are created with only name and optional BoM; status defaults to Active."
        ]
      },
      {
        "category": "Project Updates",
        "rules": [
          "Existing projects can have their name, BoM, and status updated through a single submission."
        ]
      },
      {
        "category": "Jobs Assignment",
        "rules": [
          "Projects can have jobs assigned to them after creation through a separate modal interface."
        ]
      }
    ]
  },
  "tasks-jobs": {
    "key": "tasks-jobs",
    "label": "Jobs",
    "match": "/tasks/jobs",
    "groups": [
      {
        "category": "Validation",
        "rules": [
          "Job name is required and must be at least 1 character after trimming whitespace.",
          "Store and Extraction type are required fields; both cannot be selected if a parent job is already chosen during creation.",
          "Extraction type and store become disabled after creation; they cannot be changed when editing an existing job.",
          "Definition method is required and accepts only Seed or Box values."
        ]
      },
      {
        "category": "Conditional Logic",
        "rules": [
          "Virtual store geolocation mode is only available when extraction type is Digital Shelf PDP; otherwise it is disabled.",
          "PDP multivariants checkbox only appears when extraction type is Digital Shelf PDP."
        ]
      },
      {
        "category": "Inheritance",
        "rules": [
          "When a parent job is selected during creation, store and extraction type are automatically inherited from the parent and the selection fields become disabled."
        ]
      },
      {
        "category": "Status",
        "rules": [
          "Status defaults to Active when creating a new job; only Active and Inactive statuses are allowed."
        ]
      }
    ]
  },
  "tasks-seeds": {
    "key": "tasks-seeds",
    "label": "Seeds",
    "match": "/tasks/seeds",
    "groups": [
      {
        "category": "Core Fields",
        "rules": [
          "Description, store, and category are mandatory on all seeds. Store selection is disabled after seed creation to prevent reassigning existing seeds."
        ]
      },
      {
        "category": "Seed Type Variations",
        "rules": [
          "Different seed types require different attribute combinations: keyword-based seeds require keyword and keywordType; URL-based seeds require a valid URL; API-based seeds require apiOrigin key-value pairs. Page type is required for Ad URL, Shelf URL, Digital Shelf PLP URL/API, Media URL/API, and Shelf API seeds."
        ]
      },
      {
        "category": "Keyword Management",
        "rules": [
          "When keyword type is set to Branded, the Brand field becomes visible and available for selection. Changing from Branded to Category keyword type clears the selected brand."
        ]
      },
      {
        "category": "Pagination Control",
        "rules": [
          "Max pages is only applicable to paginated seed types (Search Keyword, Shelf URL, Digital Shelf PLP URL, Media URL, Media Keyword, Shelf API). When pagination is disabled, max pages defaults to 1. Max pages must be an integer greater than 0."
        ]
      },
      {
        "category": "Destination Configuration",
        "rules": [
          "Destination is optional but when enabled requires both an extraction type and at least one job selection. Jobs list is filtered by the selected extraction type and store. Changing extraction type automatically clears the jobs selection."
        ]
      },
      {
        "category": "PDP Seed Tracking",
        "rules": [
          "Digital Shelf PDP seeds track discovery key and whether they originated from discovery. Current location is automatically populated from system state and is read-only. isFromDiscovery is read-only and cannot be edited by users."
        ]
      },
      {
        "category": "Numeric Constraints",
        "rules": [
          "Max rank (number of results to extract per seed) has a minimum value of 1 and defaults to 48. Max pages must be an integer with minimum value of 1. Both fields are required when applicable to the seed type."
        ]
      },
      {
        "category": "Status Management",
        "rules": [
          "Status field (Active/Inactive) only appears when editing an existing seed, not during creation. QA candidate checkbox is optional and determines whether the seed is included in the QA process."
        ]
      }
    ]
  }
};
