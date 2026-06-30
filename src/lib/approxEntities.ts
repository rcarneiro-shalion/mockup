// AUTO-GENERATED approximated-listing specs (columns/filters/fields from console-frontend).
import type { ApproxSpec } from "@/components/common/EntityListPage";

export const SPECS: Record<string, ApproxSpec> = {
  "manufacturers": {
    "key": "manufacturers",
    "title": "Manufacturers",
    "addLabel": "Add manufacturer",
    "search": "Search by manufacturers name",
    "filters": [
      "Name",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Created at",
        "key": "creationDateTime"
      },
      {
        "label": "Updated at",
        "key": "lastUpdatedDateTime"
      }
    ],
    "rows": [
      {
        "id": "mfr-001",
        "name": "Toyota Motor Corporation",
        "creationDateTime": "2024-11-15 09:30:00",
        "lastUpdatedDateTime": "2025-03-22 14:15:30"
      },
      {
        "id": "mfr-002",
        "name": "Honda Manufacturing",
        "creationDateTime": "2024-10-08 10:45:12",
        "lastUpdatedDateTime": "2025-02-14 11:20:45"
      },
      {
        "id": "mfr-003",
        "name": "Volkswagen AG",
        "creationDateTime": "2024-12-01 13:22:18",
        "lastUpdatedDateTime": "2025-04-05 16:50:22"
      },
      {
        "id": "mfr-004",
        "name": "Ford Motor Company",
        "creationDateTime": "2024-09-20 08:15:00",
        "lastUpdatedDateTime": "2025-01-30 09:45:15"
      },
      {
        "id": "mfr-005",
        "name": "BMW Group",
        "creationDateTime": "2024-11-28 14:30:45",
        "lastUpdatedDateTime": "2025-03-10 13:25:30"
      },
      {
        "id": "mfr-006",
        "name": "Hyundai Motor Company",
        "creationDateTime": "2024-10-25 11:05:22",
        "lastUpdatedDateTime": "2025-02-28 10:18:40"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      }
    ]
  },
  "promotions": {
    "key": "promotions",
    "title": "Promotions",
    "addLabel": "Add promotion",
    "search": "Search promotions by name",
    "filters": [
      "Name",
      "Promotion group",
      "Created at",
      "Updated at"
    ],
    "total": 342,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Promo code",
        "key": "promoCode"
      },
      {
        "label": "Promotion group",
        "key": "promotionGroup"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "promo-001",
        "name": "Summer Sale 2026",
        "promoCode": "SUMMER2026",
        "promotionGroup": "seasonal promotion",
        "createdAt": "2026-01-15 10:30:00",
        "updatedAt": "2026-06-08 14:22:15"
      },
      {
        "id": "promo-002",
        "name": "Welcome First Time",
        "promoCode": "WELCOME10",
        "promotionGroup": "new customer promotion",
        "createdAt": "2025-11-20 09:15:45",
        "updatedAt": "2026-05-30 16:45:20"
      },
      {
        "id": "promo-003",
        "name": "Bundle Deal March",
        "promoCode": "-",
        "promotionGroup": "bundle promotion",
        "createdAt": "2026-02-28 11:00:00",
        "updatedAt": "2026-06-10 08:30:05"
      },
      {
        "id": "promo-004",
        "name": "Flash Hour Weekends",
        "promoCode": "FLASH50",
        "promotionGroup": "flash sale promotion",
        "createdAt": "2026-03-01 13:20:30",
        "updatedAt": "2026-06-09 19:15:40"
      },
      {
        "id": "promo-005",
        "name": "Loyalty Rewards Program",
        "promoCode": "LOYALTY25",
        "promotionGroup": "loyalty promotion",
        "createdAt": "2025-09-10 07:45:00",
        "updatedAt": "2026-06-05 12:50:25"
      },
      {
        "id": "promo-006",
        "name": "Referral Bonus Campaign",
        "promoCode": "REFER20",
        "promotionGroup": "referral promotion",
        "createdAt": "2026-04-12 15:30:15",
        "updatedAt": "2026-06-02 10:25:50"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "promoCode",
        "label": "Promo code",
        "type": "text",
        "required": false
      },
      {
        "key": "promotionGroup",
        "label": "Promotion group",
        "type": "select",
        "required": false,
        "options": [
          "Base promotion",
          "Bundle promotion",
          "Discount promotion",
          "Gift promotion",
          "Loyalty promotion",
          "Recurring promotion",
          "Volume promotion"
        ]
      }
    ]
  },
  "listings": {
    "key": "listings",
    "title": "All listings",
    "addLabel": "Create listings",
    "search": "Search all listings by title, matching string and href",
    "filters": [
      "Search string",
      "Retailers",
      "Brands",
      "Brand null",
      "Categories",
      "Category null",
      "Clients",
      "Discovery key",
      "Href",
      "Matching count",
      "Matching type",
      "First date found",
      "Last date found",
      "Sources",
      "Seed",
      "Image url",
      "Hash",
      "Brand regex",
      "Country",
      "Result type",
      "Manufacturer",
      "Is QA candidate"
    ],
    "total": 4285,
    "columns": [
      {
        "label": "Image",
        "key": "image_url"
      },
      {
        "label": "Title",
        "key": "title"
      },
      {
        "label": "Retailer",
        "key": "retailer_name"
      },
      {
        "label": "Brand",
        "key": "brand_name"
      },
      {
        "label": "Category",
        "key": "category_name"
      },
      {
        "label": "Discovery key",
        "key": "matching_string"
      },
      {
        "label": "First date found",
        "key": "first_date_found"
      },
      {
        "label": "Last date found",
        "key": "last_date_found"
      },
      {
        "label": "Matching type",
        "key": "matching_type"
      },
      {
        "label": "Matching count",
        "key": "matching_count"
      }
    ],
    "rows": [
      {
        "id": "abc123d4e5f6g7h8",
        "image_url": "https://cdn.example.com/products/cola-bottle-500ml.jpg",
        "title": "Coca-Cola Classic 500ml Bottle",
        "retailer_name": "Walmart",
        "brand_name": "Coca-Cola",
        "category_name": "Beverages",
        "matching_string": "cola_soft_drink_500",
        "first_date_found": "2024-12-15T10:30:00Z",
        "last_date_found": "2025-06-08T14:22:00Z",
        "matching_type": "exact",
        "matching_count": 47
      },
      {
        "id": "xyz789a1b2c3d4e5",
        "image_url": "https://cdn.example.com/products/pepsi-zero-350ml.jpg",
        "title": "Pepsi Zero Sugar 350ml Can",
        "retailer_name": "Target",
        "brand_name": "Pepsi",
        "category_name": "Beverages",
        "matching_string": "pepsi_zero_diet_350",
        "first_date_found": "2025-01-22T09:15:00Z",
        "last_date_found": "2025-06-10T11:45:00Z",
        "matching_type": "fuzzy",
        "matching_count": 23
      },
      {
        "id": "def456g7h8i9j0k1",
        "image_url": "https://cdn.example.com/products/sprite-lemon-lime-1l.jpg",
        "title": "Sprite Lemon-Lime 1L Bottle",
        "retailer_name": "Kroger",
        "brand_name": "Sprite",
        "category_name": "Beverages",
        "matching_string": "sprite_citrus_1000",
        "first_date_found": "2024-11-03T16:20:00Z",
        "last_date_found": "2025-06-09T13:55:00Z",
        "matching_type": "regex",
        "matching_count": 35
      },
      {
        "id": "ghi234j5k6l7m8n9",
        "image_url": "https://cdn.example.com/products/fanta-orange-2l.jpg",
        "title": "Fanta Orange 2L Bottle",
        "retailer_name": "Costco",
        "brand_name": "Fanta",
        "category_name": "Beverages",
        "matching_string": "fanta_orange_2000",
        "first_date_found": "2025-02-18T12:05:00Z",
        "last_date_found": "2025-06-07T08:32:00Z",
        "matching_type": "exact",
        "matching_count": 19
      },
      {
        "id": "jkl567m8n9o0p1q2",
        "image_url": "",
        "title": "Dr Pepper Classic 330ml Can",
        "retailer_name": "Amazon Fresh",
        "brand_name": "Dr Pepper",
        "category_name": "Beverages",
        "matching_string": "drpepper_cola_330",
        "first_date_found": "2025-03-05T14:40:00Z",
        "last_date_found": "2025-06-06T10:18:00Z",
        "matching_type": "fuzzy",
        "matching_count": 12
      },
      {
        "id": "mno890p1q2r3s4t5",
        "image_url": "https://cdn.example.com/products/mountain-dew-6pack.jpg",
        "title": "Mountain Dew Original 6-Pack Cans",
        "retailer_name": "Best Buy",
        "brand_name": "Mountain Dew",
        "category_name": "Beverages",
        "matching_string": "mountdew_citrus_6pack",
        "first_date_found": "2024-10-12T11:25:00Z",
        "last_date_found": "2025-06-08T15:08:00Z",
        "matching_type": "exact",
        "matching_count": 56
      }
    ],
    "fields": [
      {
        "key": "brand",
        "label": "Brand",
        "type": "text",
        "required": true
      },
      {
        "key": "brandCategory",
        "label": "Category",
        "type": "text",
        "required": false
      }
    ]
  },
  "fsa-listings": {
    "key": "fsa-listings",
    "title": "FSA listings",
    "addLabel": "",
    "search": "Search fsa listings",
    "filters": [
      "Search string",
      "Retailers",
      "Brands",
      "Brand null",
      "Categories",
      "Category null",
      "Clients",
      "Discovery key",
      "Image url",
      "Matching count",
      "Matching type",
      "First date found",
      "Last date found",
      "Sources",
      "Seed",
      "Hash",
      "Brand regex",
      "Country",
      "Manufacturer",
      "Is QA candidate"
    ],
    "total": 4782,
    "columns": [
      {
        "label": "Image",
        "key": "item_image_url"
      },
      {
        "label": "Text",
        "key": "text"
      },
      {
        "label": "Retailer",
        "key": "retailer_name"
      },
      {
        "label": "Brand",
        "key": "brand_name"
      },
      {
        "label": "Category",
        "key": "category_name"
      },
      {
        "label": "Edition category",
        "key": "edition_name"
      },
      {
        "label": "Discovery key",
        "key": "matching_string"
      },
      {
        "label": "First date found",
        "key": "first_date_found"
      },
      {
        "label": "Last date found",
        "key": "last_date_found"
      },
      {
        "label": "Matching type",
        "key": "matching_type"
      },
      {
        "label": "Matching count",
        "key": "matching_count"
      }
    ],
    "rows": [
      {
        "id": "hash_001",
        "item_image_url": "https://images.example.com/prod_001.jpg",
        "text": "Premium Organic Green Tea 500g",
        "retailer_name": "EcoMart Online",
        "brand_name": "GreenLeaf",
        "category_name": "Beverages",
        "edition_name": "Specialty Foods",
        "matching_string": "organic_green_tea_premium",
        "first_date_found": "2024-08-15T10:30:00Z",
        "last_date_found": "2026-06-08T14:22:00Z",
        "matching_type": "EXACT",
        "matching_count": 45
      },
      {
        "id": "hash_002",
        "item_image_url": "https://images.example.com/prod_002.jpg",
        "text": "Stainless Steel Water Bottle 1L",
        "retailer_name": "FreshStyle Store",
        "brand_name": "HydroFlex",
        "category_name": "Kitchen & Dining",
        "edition_name": "Household",
        "matching_string": "water_bottle_stainless",
        "first_date_found": "2024-09-02T08:15:00Z",
        "last_date_found": "2026-06-09T11:45:00Z",
        "matching_type": "FUZZY",
        "matching_count": 28
      },
      {
        "id": "hash_003",
        "item_image_url": "https://images.example.com/prod_003.jpg",
        "text": "Natural Bamboo Cutting Board Set",
        "retailer_name": "Nature's Choice",
        "brand_name": "EcoHome",
        "category_name": "Kitchen & Dining",
        "edition_name": "Household",
        "matching_string": "bamboo_cutting_board",
        "first_date_found": "2024-07-20T09:00:00Z",
        "last_date_found": "2026-06-10T13:18:00Z",
        "matching_type": "PARTIAL",
        "matching_count": 67
      },
      {
        "id": "hash_004",
        "item_image_url": "",
        "text": "Organic Cotton T-Shirt XL",
        "retailer_name": "Urban Fashion",
        "brand_name": "",
        "category_name": "Apparel",
        "edition_name": "Fashion",
        "matching_string": "cotton_tshirt_xl",
        "first_date_found": "2024-10-11T16:30:00Z",
        "last_date_found": "2026-06-07T09:52:00Z",
        "matching_type": "EXACT",
        "matching_count": 12
      },
      {
        "id": "hash_005",
        "item_image_url": "https://images.example.com/prod_005.jpg",
        "text": "Rechargeable LED Headlamp",
        "retailer_name": "Tech Gadgets Pro",
        "brand_name": "PowerLight",
        "category_name": "",
        "edition_name": "Electronics",
        "matching_string": "led_headlamp_rechargeable",
        "first_date_found": "2024-06-25T12:45:00Z",
        "last_date_found": "2026-06-09T15:33:00Z",
        "matching_type": "FUZZY",
        "matching_count": 34
      },
      {
        "id": "hash_006",
        "item_image_url": "https://images.example.com/prod_006.jpg",
        "text": "Lavender Essential Oil 30ml",
        "retailer_name": "Wellness Retail",
        "brand_name": "AromaBliss",
        "category_name": "Beauty & Health",
        "edition_name": "Personal Care",
        "matching_string": "lavender_essential_oil",
        "first_date_found": "2024-11-03T14:20:00Z",
        "last_date_found": "2026-06-08T10:05:00Z",
        "matching_type": "EXACT",
        "matching_count": 91
      }
    ],
    "fields": [
      {
        "key": "note",
        "label": "Note",
        "type": "textarea",
        "required": true
      }
    ]
  },
  "ads": {
    "key": "ads",
    "title": "All ads",
    "addLabel": "Create ads",
    "search": "Search all ads by ocr text",
    "filters": [
      "Ocr text",
      "Promotions",
      "Promotion null",
      "Brands",
      "Brand null",
      "Categories",
      "Category null",
      "Clients",
      "Retailers",
      "Stores",
      "Image url",
      "Matching type",
      "Matching count",
      "First date found",
      "Last date found",
      "Sources",
      "Seed",
      "Hash",
      "Brand regex",
      "Promotion regex",
      "Country",
      "Result type",
      "Manufacturer",
      "Ad type",
      "Page type",
      "Download status",
      "Conversion status",
      "Text detection status",
      "Is QA candidate",
      "Is multibrand"
    ],
    "total": 2847,
    "columns": [
      {
        "label": "Image",
        "key": "imageUrl"
      },
      {
        "label": "OCR text",
        "key": "ocrText"
      },
      {
        "label": "Retailer",
        "key": "retailerName"
      },
      {
        "label": "Brands",
        "key": "brandNames"
      },
      {
        "label": "Categories",
        "key": "categoryNames"
      },
      {
        "label": "Promotions",
        "key": "promotionNames"
      },
      {
        "label": "First date found",
        "key": "firstDateFound"
      },
      {
        "label": "Last date found",
        "key": "lastDateFound"
      },
      {
        "label": "Matching type",
        "key": "matchingType"
      },
      {
        "label": "Matching count",
        "key": "matchingCount"
      },
      {
        "label": "Download status",
        "key": "downloadStatus"
      },
      {
        "label": "Conversion status",
        "key": "conversionStatus"
      },
      {
        "label": "Text detection status",
        "key": "textDetectionStatus"
      }
    ],
    "rows": [
      {
        "id": "a8f2e9c1d5b4",
        "imageUrl": "https://cdn.example.com/ads/a8f2e9c1d5b4.jpg",
        "ocrText": "Fresh Coca-Cola 2L Bottle - Save 30%",
        "retailerName": "Carrefour",
        "brandNames": "Coca-Cola",
        "categoryNames": "Beverages,Soft Drinks",
        "promotionNames": "Summer Sale,Bundle Offers",
        "firstDateFound": "2024-05-15",
        "lastDateFound": "2024-06-10",
        "matchingType": "exact",
        "matchingCount": 247,
        "downloadStatus": "completed",
        "conversionStatus": "success",
        "textDetectionStatus": "success"
      },
      {
        "id": "b3c7f1e2a9d6",
        "imageUrl": "https://cdn.example.com/ads/b3c7f1e2a9d6.jpg",
        "ocrText": "Pepsi Family Pack 6x330ml",
        "retailerName": "Walmart",
        "brandNames": "Pepsi",
        "categoryNames": "Beverages",
        "promotionNames": "Family Bundle",
        "firstDateFound": "2024-04-20",
        "lastDateFound": "2024-06-08",
        "matchingType": "partial",
        "matchingCount": 189,
        "downloadStatus": "completed",
        "conversionStatus": "success",
        "textDetectionStatus": "success"
      },
      {
        "id": "c6d8b2f4e1c3",
        "imageUrl": "https://cdn.example.com/ads/c6d8b2f4e1c3.jpg",
        "ocrText": "Sprite Zero Sugar - Limited Time Offer",
        "retailerName": "Tesco",
        "brandNames": "Sprite,The Coca-Cola Company",
        "categoryNames": "Beverages,Diet Drinks",
        "promotionNames": "Limited Time,Flash Sale",
        "firstDateFound": "2024-05-28",
        "lastDateFound": "2024-06-10",
        "matchingType": "fuzzy",
        "matchingCount": 156,
        "downloadStatus": "completed",
        "conversionStatus": "failed",
        "textDetectionStatus": "success"
      },
      {
        "id": "d9e4a5c1b8f2",
        "imageUrl": "https://cdn.example.com/ads/d9e4a5c1b8f2.jpg",
        "ocrText": "Fanta Orange 1L - Buy 2 Get 1 Free",
        "retailerName": "Sainsbury's",
        "brandNames": "Fanta",
        "categoryNames": "Beverages,Soft Drinks,Flavored Drinks",
        "promotionNames": "Buy 2 Get 1 Free",
        "firstDateFound": "2024-06-02",
        "lastDateFound": "2024-06-10",
        "matchingType": "exact",
        "matchingCount": 312,
        "downloadStatus": "completed",
        "conversionStatus": "success",
        "textDetectionStatus": "success"
      },
      {
        "id": "e7f3d2a6c9b1",
        "imageUrl": "https://cdn.example.com/ads/e7f3d2a6c9b1.jpg",
        "ocrText": "Minute Maid Orange Juice Premium Quality",
        "retailerName": "Kroger",
        "brandNames": "Minute Maid,The Coca-Cola Company",
        "categoryNames": "Beverages,Juices,Premium",
        "promotionNames": "",
        "firstDateFound": "2024-03-10",
        "lastDateFound": "2024-06-09",
        "matchingType": "partial",
        "matchingCount": 98,
        "downloadStatus": "pending",
        "conversionStatus": "pending",
        "textDetectionStatus": "pending"
      },
      {
        "id": "f2a9b4d7e5c8",
        "imageUrl": "https://cdn.example.com/ads/f2a9b4d7e5c8.jpg",
        "ocrText": "Dasani Water Bottles 24 Pack Eco-Friendly",
        "retailerName": "ASDA",
        "brandNames": "Dasani,The Coca-Cola Company",
        "categoryNames": "Beverages,Water,Eco-Friendly",
        "promotionNames": "Eco Initiative",
        "firstDateFound": "2024-05-22",
        "lastDateFound": "2024-06-10",
        "matchingType": "exact",
        "matchingCount": 201,
        "downloadStatus": "completed",
        "conversionStatus": "success",
        "textDetectionStatus": "success"
      }
    ],
    "fields": [
      {
        "key": "brand",
        "label": "Brand",
        "type": "text",
        "required": true
      },
      {
        "key": "category",
        "label": "Category",
        "type": "text",
        "required": false
      },
      {
        "key": "promotion",
        "label": "Promotion",
        "type": "text",
        "required": true
      }
    ]
  },
  "fsa-sections": {
    "key": "fsa-sections",
    "title": "FSA sections",
    "addLabel": "New fsa section",
    "search": "Search fsa sections by name",
    "filters": [
      "Name"
    ],
    "total": 47,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "fsa-001",
        "name": "Urban Core District",
        "createdAt": "2026-01-15 09:32:00",
        "updatedAt": "2026-05-22 14:18:00"
      },
      {
        "id": "fsa-002",
        "name": "Suburban Expansion Zone",
        "createdAt": "2025-11-08 11:45:00",
        "updatedAt": "2026-04-10 16:22:00"
      },
      {
        "id": "fsa-003",
        "name": "Industrial Corridor",
        "createdAt": "2026-02-20 08:15:00",
        "updatedAt": "2026-03-05 13:44:00"
      },
      {
        "id": "fsa-004",
        "name": "Waterfront Development",
        "createdAt": "2025-10-12 10:20:00",
        "updatedAt": "2026-06-01 09:55:00"
      },
      {
        "id": "fsa-005",
        "name": "Residential Heritage Area",
        "createdAt": "2026-03-27 14:30:00",
        "updatedAt": "2026-05-15 11:12:00"
      },
      {
        "id": "fsa-006",
        "name": "Technology Park South",
        "createdAt": "2025-12-03 07:50:00",
        "updatedAt": "2026-02-28 15:33:00"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      }
    ]
  },
  "value-propositions": {
    "key": "value-propositions",
    "title": "Value propositions",
    "addLabel": "Create value propositions",
    "search": "Search all value propositions by text",
    "filters": [
      "Text",
      "Retailers",
      "Clients",
      "Promotions",
      "Promotion null",
      "Sources",
      "Matching type",
      "Matching count",
      "First date found",
      "Last date found",
      "Seed",
      "Hash",
      "Promotion regex",
      "Country"
    ],
    "total": 2847,
    "columns": [
      {
        "label": "Text",
        "key": "text"
      },
      {
        "label": "Retailer",
        "key": "retailerName"
      },
      {
        "label": "Promotion",
        "key": "promotionName"
      },
      {
        "label": "First date found",
        "key": "firstDateFound"
      },
      {
        "label": "Last date found",
        "key": "lastDateFound"
      },
      {
        "label": "Matching type",
        "key": "matchingType"
      },
      {
        "label": "Matching count",
        "key": "matchingCount"
      }
    ],
    "rows": [
      {
        "id": "hash_001",
        "text": "Buy 2 Get 1 Free on Premium Coffee",
        "retailerName": "Whole Foods Market",
        "promotionName": "Coffee Promo Q2",
        "firstDateFound": "2024-01-15",
        "lastDateFound": "2024-06-10",
        "matchingType": "AUTO",
        "matchingCount": 147
      },
      {
        "id": "hash_002",
        "text": "20% off entire purchase with loyalty card",
        "retailerName": "Target",
        "promotionName": "Loyalty Rewards Spring",
        "firstDateFound": "2024-02-03",
        "lastDateFound": "2024-06-08",
        "matchingType": "MANUAL",
        "matchingCount": 89
      },
      {
        "id": "hash_003",
        "text": "Free shipping on orders over $50",
        "retailerName": "Amazon",
        "promotionName": "Prime Day Deals",
        "firstDateFound": "2024-03-20",
        "lastDateFound": "2024-05-25",
        "matchingType": "AUTO",
        "matchingCount": 312
      },
      {
        "id": "hash_004",
        "text": "Clearance: up to 70% off selected items",
        "retailerName": "Walmart",
        "promotionName": "",
        "firstDateFound": "2024-04-10",
        "lastDateFound": "2024-06-09",
        "matchingType": "NO_MATCH",
        "matchingCount": 56
      },
      {
        "id": "hash_005",
        "text": "Buy one entree, get second at 50% off",
        "retailerName": "Costco",
        "promotionName": "Spring Deals",
        "firstDateFound": "2024-01-28",
        "lastDateFound": "2024-06-07",
        "matchingType": "LEGACY",
        "matchingCount": 203
      },
      {
        "id": "hash_006",
        "text": "Double Points Weekend - Earn 4x rewards",
        "retailerName": "Best Buy",
        "promotionName": "Rewards Program",
        "firstDateFound": "2024-05-01",
        "lastDateFound": "2024-06-10",
        "matchingType": "AUTO",
        "matchingCount": 428
      }
    ],
    "fields": [
      {
        "key": "promotion",
        "label": "Promotion",
        "type": "text",
        "required": true
      }
    ]
  },
  "attributes": {
    "key": "attributes",
    "title": "Attributes",
    "addLabel": "Add attribute",
    "search": "Search attributes by name",
    "filters": [
      "Name",
      "Type",
      "Data variables",
      "Multiple",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Type",
        "key": "type"
      },
      {
        "label": "Data variable",
        "key": "dataVariable"
      },
      {
        "label": "Multiple",
        "key": "isMultiple"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "attr_001",
        "name": "Product Category",
        "type": "STRING",
        "dataVariable": "category_name",
        "isMultiple": false,
        "createdAt": "2026-01-15 14:32:00",
        "updatedAt": "2026-05-22 09:18:00"
      },
      {
        "id": "attr_002",
        "name": "Price Range",
        "type": "NUMERIC",
        "dataVariable": "price_range_id",
        "isMultiple": true,
        "createdAt": "2025-11-08 10:45:00",
        "updatedAt": "2026-04-10 16:55:00"
      },
      {
        "id": "attr_003",
        "name": "Brand Name",
        "type": "STRING",
        "dataVariable": "brand_code",
        "isMultiple": false,
        "createdAt": "2026-02-20 11:20:00",
        "updatedAt": "2026-06-05 13:41:00"
      },
      {
        "id": "attr_004",
        "name": "Region",
        "type": "ENUMERATION",
        "dataVariable": "region_id",
        "isMultiple": true,
        "createdAt": "2025-10-03 08:15:00",
        "updatedAt": "2026-03-14 12:30:00"
      },
      {
        "id": "attr_005",
        "name": "Is Active",
        "type": "BOOLEAN",
        "dataVariable": "",
        "isMultiple": false,
        "createdAt": "2026-03-12 09:00:00",
        "updatedAt": "2026-06-09 15:22:00"
      },
      {
        "id": "attr_006",
        "name": "Packaging Type",
        "type": "STRING",
        "dataVariable": "packaging_code",
        "isMultiple": true,
        "createdAt": "2025-12-01 07:45:00",
        "updatedAt": "2026-05-18 10:05:00"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "type",
        "label": "Type",
        "type": "select",
        "required": true,
        "options": [
          "STRING",
          "NUMERIC",
          "BOOLEAN",
          "DATE",
          "TIMESTAMP"
        ]
      },
      {
        "key": "dataVariable",
        "label": "Data variable",
        "type": "text",
        "required": true
      },
      {
        "key": "isMultiple",
        "label": "Multiple",
        "type": "checkbox",
        "required": false
      },
      {
        "key": "inputFilter",
        "label": "Input Filters",
        "type": "textarea",
        "required": false
      }
    ]
  },
  "data-variables": {
    "key": "data-variables",
    "title": "Data variables",
    "addLabel": "New data variable",
    "search": "Search data variables by name",
    "filters": [
      "Name",
      "Type"
    ],
    "total": 47,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Type",
        "key": "type"
      }
    ],
    "rows": [
      {
        "id": "dv-001",
        "name": "customer_age",
        "type": "integer"
      },
      {
        "id": "dv-002",
        "name": "product_category",
        "type": "string"
      },
      {
        "id": "dv-003",
        "name": "purchase_amount",
        "type": "decimal"
      },
      {
        "id": "dv-004",
        "name": "is_premium_member",
        "type": "boolean"
      },
      {
        "id": "dv-005",
        "name": "region_code",
        "type": "string"
      },
      {
        "id": "dv-006",
        "name": "transaction_count",
        "type": "integer"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "type",
        "label": "Type",
        "type": "select",
        "required": true,
        "options": [
          "STRING",
          "NUMERIC",
          "BOOLEAN",
          "ENUMERATION",
          "DECIMAL",
          "INTEGER"
        ]
      }
    ]
  },
  "business-units": {
    "key": "business-units",
    "title": "Business units",
    "addLabel": "Add business unit",
    "search": "Search business units",
    "filters": [
      "Name",
      "Client",
      "Created at",
      "Updated at"
    ],
    "total": 707,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Client",
        "key": "client"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      { "id": "00fc2c02-d491-3864-885c-187ffbc9350f", "name": "Beer", "client": "Client 23", "createdAt": "2024-03-01 10:12:09", "updatedAt": "2024-03-01 10:12:09" },
      { "id": "135e7c21-98d2-36dd-b60e-fe1748c79cc7", "name": "Face", "client": "Cosnova", "createdAt": "2024-03-31 20:35:06", "updatedAt": "2024-03-31 20:35:06" },
      { "id": "1d2f3994-6b21-3b79-b8c7-e04dc42ef312", "name": "Avalancha", "client": "Coca Cola", "createdAt": "2025-11-07 09:53:32", "updatedAt": "2025-11-07 09:53:32" },
      { "id": "1ffdccb3-0566-3481-b03a-7e3bb50e1f91", "name": "Nerf", "client": "Hasbro", "createdAt": "2024-03-31 20:35:07", "updatedAt": "2024-03-31 20:35:07" },
      { "id": "22f10d8c-4819-3b6a-a61b-f02729fc8c37", "name": "Dolor de cabeza", "client": "Bayer", "createdAt": "2025-01-21 14:57:39", "updatedAt": "2025-01-21 14:57:39" },
      { "id": "29f3a34a-63d3-36f8-8f9d-f8db52af4e8b", "name": "Lips", "client": "Cosnova", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "2c9543a3-dc4f-3784-a7ee-10f4c5e757fb", "name": "New assortment H2 2025", "client": "Cosnova", "createdAt": "2025-07-24 17:56:41", "updatedAt": "2025-07-24 17:56:41" },
      { "id": "2fc8884d-145b-3e76-8d47-86ab5fdbb1b5", "name": "Cereal - Grains", "client": "Client 42", "createdAt": "2025-02-26 21:46:11", "updatedAt": "2025-02-26 21:46:11" },
      { "id": "3076d50b-78d7-334e-b75b-b5d27aa56b58", "name": "Rum", "client": "Client 23", "createdAt": "2024-03-01 10:12:10", "updatedAt": "2024-03-01 10:12:10" },
      { "id": "32d7e653-7b9e-314b-80a4-24beffc77aeb", "name": "Eyes", "client": "Cosnova", "createdAt": "2024-03-31 20:35:06", "updatedAt": "2024-03-31 20:35:06" },
      { "id": "346d1a1a-aaa0-3876-9e14-98457024863f", "name": "Decoración Botes", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "3f70d711-bec9-3523-9b54-b45c186174b2", "name": "Seasonal - Back to School", "client": "Mattel", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "451080d2-8d63-34e5-b39b-172b611c4068", "name": "Aesthetics", "client": "Client 27", "createdAt": "2024-02-21 13:43:17", "updatedAt": "2024-02-21 13:43:17" },
      { "id": "464d98d6-1bba-30c7-b9de-671ac8f76562", "name": "Mixes", "client": "JDE", "createdAt": "2025-07-28 12:26:11", "updatedAt": "2025-07-28 12:26:11" },
      { "id": "473cf843-5a54-3393-85f3-8af13d04e313", "name": "Tangerina", "client": "Coca Cola", "createdAt": "2025-06-26 11:06:19", "updatedAt": "2025-06-26 11:06:19" },
      { "id": "489a25e7-969f-3484-98ae-97cc863c76e8", "name": "Bertolli", "client": "Client 17", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "56a5ac00-77ac-38e0-a28b-75d1c53db1b0", "name": "Derma", "client": "Client 27", "createdAt": "2024-02-21 13:42:14", "updatedAt": "2024-02-21 13:42:34" },
      { "id": "5b585526-f873-3a99-8949-8ff626571831", "name": "Salty Snacks", "client": "Client 42", "createdAt": "2025-02-26 21:46:11", "updatedAt": "2025-02-26 21:46:11" },
      { "id": "5d0fd547-e603-3124-92d4-b0f9e4dbbde1", "name": "Demi-Sec", "client": "Client 10", "createdAt": "2024-11-21 16:34:49", "updatedAt": "2024-11-21 16:34:49" },
      { "id": "629c3149-7bed-3ec5-b4e5-29660a36500a", "name": "Sabor Original", "client": "Coca Cola", "createdAt": "2025-09-26 15:04:30", "updatedAt": "2025-09-26 15:04:30" },
      { "id": "68d06b8e-7b4e-3d33-adaf-c3858b733978", "name": "Antigripales", "client": "Bayer", "createdAt": "2025-01-21 14:57:40", "updatedAt": "2025-01-21 14:57:40" },
      { "id": "7185a807-cfef-3bf1-acd2-98e0cf1ae58b", "name": "Whiskey", "client": "Client 23", "createdAt": "2024-03-01 10:12:10", "updatedAt": "2024-03-01 10:12:10" },
      { "id": "79ce901f-8e94-3e45-a0f2-d2f2abaea6d2", "name": "Bia và trái cây lên men", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "80ea7d59-935c-33ba-b2f2-2da76b57bd94", "name": "Lager Beer", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:06", "updatedAt": "2024-03-31 20:35:06" },
      { "id": "8c5be04f-76db-3647-a05c-b3d9299d00b9", "name": "Beans", "client": "JDE", "createdAt": "2025-08-25 19:44:47", "updatedAt": "2025-08-25 19:44:47" },
      { "id": "934dc79e-609a-384b-8178-6cba3df913f2", "name": "Drinks", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "a18d24d6-6d05-3678-abb7-473b031a3dae", "name": "Mixed Berry", "client": "Coca Cola", "createdAt": "2025-11-07 09:52:36", "updatedAt": "2025-11-07 09:52:36" },
      { "id": "ac9ede30-05ae-35c5-8d85-3e90ccb5da9b", "name": "TAWAN_20B", "client": "Client 42", "createdAt": "2025-09-16 17:41:01", "updatedAt": "2025-09-16 17:41:01" },
      { "id": "b4807032-c6ff-3a82-b2ab-a2ed91ba2e2a", "name": "Mango y Fresa", "client": "Coca Cola", "createdAt": "2025-11-07 09:53:20", "updatedAt": "2025-11-07 09:53:20" },
      { "id": "b59051c0-045a-373f-9aca-01248aa9822b", "name": "Gin", "client": "Client 23", "createdAt": "2024-03-01 10:12:10", "updatedAt": "2024-03-01 10:12:10" },
      { "id": "b6d1be77-4c12-3590-be29-4f4c1a8d92b9", "name": "Foto", "client": "Client 27", "createdAt": "2024-02-21 13:43:07", "updatedAt": "2024-02-21 13:43:07" },
      { "id": "bba5b3f0-d56f-3813-b796-3d7df9df6a5e", "name": "Monopoly", "client": "Hasbro", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "bcdfacf6-b0f5-3cca-8c66-86dda343dc01", "name": "Manzana", "client": "Coca Cola", "createdAt": "2025-03-14 17:49:58", "updatedAt": "2025-03-14 17:49:58" },
      { "id": "bda59f02-83c7-3dda-b67b-51716e3a44f7", "name": "Nutrition", "client": "Client 42", "createdAt": "2025-03-13 21:37:45", "updatedAt": "2025-03-13 21:37:45" },
      { "id": "c21f928b-3a2d-3398-822e-5f6fc0f3ab23", "name": "Grocery", "client": "Affinity Petcare", "createdAt": "2024-04-10 15:32:24", "updatedAt": "2024-04-10 15:32:24" },
      { "id": "c586309b-4796-348d-94bc-ad3b9212eb5a", "name": "WHISKY", "client": "Client 40", "createdAt": "2025-07-31 13:53:05", "updatedAt": "2025-07-31 13:53:05" },
      { "id": "d0c29395-a74d-3fc3-b987-2c0cab174986", "name": "Personal Care", "client": "Spectrum Brands", "createdAt": "2025-04-08 15:53:21", "updatedAt": "2025-04-08 15:53:21" },
      { "id": "df151c7d-0bed-3568-ae47-86d64ecfe7ce", "name": "LAYS_20B", "client": "Client 42", "createdAt": "2025-09-16 13:20:59", "updatedAt": "2025-09-16 13:20:59" },
      { "id": "ec0e9721-ad9b-362f-a4fd-8299db771def", "name": "LLD", "client": "Loreal", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "eef59ccd-9a5a-3236-aaba-1aad4cc01d29", "name": "NCC", "client": "JDE", "createdAt": "2025-03-31 10:32:10", "updatedAt": "2025-03-31 10:32:10" },
      { "id": "ef00954e-574b-36ca-a409-7e9c6d2e54aa", "name": "Super Soaker", "client": "Hasbro", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "ef55ad5d-deaf-3885-a626-a98aee9ca607", "name": "Play-Doh", "client": "Hasbro", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "f0456e22-d6d1-3517-9ab2-510d8d09651d", "name": "Limón", "client": "Coca Cola", "createdAt": "2025-05-15 14:14:07", "updatedAt": "2025-05-27 15:50:45" },
      { "id": "f4619d69-59de-3c47-b9ee-b37cf7aa3667", "name": "Melocotón", "client": "Coca Cola", "createdAt": "2025-11-07 09:52:51", "updatedAt": "2025-11-07 09:52:51" },
      { "id": "f8647903-12d4-3a84-85bf-b7474987fda1", "name": "Greek", "client": "JDE", "createdAt": "2025-07-28 12:22:09", "updatedAt": "2025-07-28 12:22:09" },
      { "id": "fa8d1809-0328-3d8c-a5be-81a043fa7355", "name": "New assortment H1 2025", "client": "Cosnova", "createdAt": "2025-04-22 15:44:21", "updatedAt": "2025-04-22 15:44:21" },
      { "id": "9c3a42be-ac19-3891-9fd1-601a493d0ac3", "name": "001 Man EDP", "client": "Client 21", "createdAt": "2025-10-07 14:28:54", "updatedAt": "2025-10-07 14:28:54" },
      { "id": "0da407ad-b95d-3810-8d28-b158722251a8", "name": "001 Man EDT", "client": "Client 21", "createdAt": "2025-10-07 14:28:17", "updatedAt": "2025-10-07 14:28:17" },
      { "id": "d24a6294-6c62-3450-93e1-86ee653f7978", "name": "001 Woman EDP", "client": "Client 21", "createdAt": "2025-10-07 14:28:39", "updatedAt": "2025-10-07 14:28:39" },
      { "id": "1affb834-de8f-368a-9b1b-34ad3e25e81a", "name": "001 Woman EDT", "client": "Client 21", "createdAt": "2025-10-07 14:27:57", "updatedAt": "2025-10-07 14:27:57" },
      { "id": "00dc73d1-8673-3395-a246-cfff57ac050a", "name": "7 Cobalt", "client": "Client 21", "createdAt": "2025-10-07 14:29:28", "updatedAt": "2025-10-07 14:29:28" },
      { "id": "d7c44c69-5ff1-3ea6-a74f-1aacea2a1d4c", "name": "7 EDT", "client": "Client 21", "createdAt": "2025-10-07 14:30:18", "updatedAt": "2025-10-07 14:30:18" },
      { "id": "92ad542f-09e2-350e-b399-b5fa04db10ad", "name": "7 Up", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "d309d697-86fb-3b00-9e3e-eb2337dfb0ac", "name": "Abacaxi", "client": "Coca Cola", "createdAt": "2025-06-26 10:41:39", "updatedAt": "2025-06-26 10:41:39" },
      { "id": "1a03e2d0-ecc7-3141-acdc-ee42bc7cec63", "name": "Abacaxi e Kiwi", "client": "Coca Cola", "createdAt": "2025-06-26 10:42:03", "updatedAt": "2025-06-26 10:42:03" },
      { "id": "ea0a4a72-b9b0-3381-8bb6-be47b9c9849a", "name": "Abacaxi e tangerina", "client": "Coca Cola", "createdAt": "2026-02-04 14:57:57", "updatedAt": "2026-02-04 14:57:57" },
      { "id": "407ba186-4f0c-3506-a2b3-998be9b20513", "name": "Absolut Sprite", "client": "Coca Cola", "createdAt": "2025-06-26 10:45:17", "updatedAt": "2025-06-26 10:45:17" },
      { "id": "e6ac707a-c0f3-3048-93e1-987658d15ec0", "name": "ACD", "client": "Loreal", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "1b2c5262-b241-3394-8b56-315957d81515", "name": "Adivina Quién", "client": "Hasbro", "createdAt": "2024-03-31 20:35:07", "updatedAt": "2024-03-31 20:35:07" },
      { "id": "0b582b0e-0787-32da-bb56-97948ed1ae59", "name": "Agua", "client": "Coca Cola", "createdAt": "2025-03-14 17:51:01", "updatedAt": "2025-03-14 17:51:01" },
      { "id": "df4b010d-9999-3d54-9435-fe9cca1810a4", "name": "Agua EDT", "client": "Client 21", "createdAt": "2025-10-07 14:29:42", "updatedAt": "2025-10-07 14:29:42" },
      { "id": "08b26287-3a90-3db5-bc27-b88d51750d13", "name": "Agua El", "client": "Client 21", "createdAt": "2025-10-07 14:31:16", "updatedAt": "2025-10-07 14:31:16" },
      { "id": "4fc3acc0-d6ec-3fc7-84c9-6f4a3280ee83", "name": "Agua Ella", "client": "Client 21", "createdAt": "2025-10-07 14:30:55", "updatedAt": "2025-10-07 14:30:55" },
      { "id": "1473f090-cddf-3cfe-92a2-996b2d3001d6", "name": "Agua Mar de Coral", "client": "Client 21", "createdAt": "2025-10-07 14:30:00", "updatedAt": "2025-10-07 14:30:00" },
      { "id": "b2aad4ba-3f00-33e2-84a7-d8b3232da92b", "name": "Agua Tonica", "client": "Coca Cola", "createdAt": "2025-05-12 13:22:23", "updatedAt": "2025-05-12 13:22:23" },
      { "id": "da31c3a7-8e8f-4d53-926e-2daa58573162", "name": "Aguakina", "client": "Coca Cola", "createdAt": "2026-06-16 14:10:43", "updatedAt": "2026-06-16 14:10:43" },
      { "id": "06d05952-fe67-3c7f-84bd-f734286b4fce", "name": "AGUARDENTE", "client": "Client 40", "createdAt": "2025-07-31 13:54:26", "updatedAt": "2025-07-31 13:54:26" },
      { "id": "b3be6823-69be-3f12-9e27-007880b563ea", "name": "Air Fryer", "client": "Client 17", "createdAt": "2024-08-06 12:36:14", "updatedAt": "2024-08-06 12:36:14" },
      { "id": "6a9e1c93-a152-31a2-891c-261be14b56d9", "name": "Aire Anthesis EDP", "client": "Client 21", "createdAt": "2025-10-07 14:43:10", "updatedAt": "2025-10-07 14:43:10" },
      { "id": "8b90f5b8-2912-39bc-a5c4-c4ca38c64e5a", "name": "Aire EDT", "client": "Client 21", "createdAt": "2025-10-07 14:39:47", "updatedAt": "2025-10-07 14:39:47" },
      { "id": "c4a8e533-7c9b-311c-b118-60eee68ea0d3", "name": "Aire Sutileza", "client": "Client 21", "createdAt": "2025-10-07 14:40:00", "updatedAt": "2025-10-07 14:40:00" },
      { "id": "63635234-214d-37ef-8737-0a7a9ea87dd7", "name": "Alfajores", "client": "Client 11", "createdAt": "2024-03-31 20:35:07", "updatedAt": "2024-03-31 20:35:07" },
      { "id": "e323f042-da29-32a5-9628-7110e472b358", "name": "Almendras", "client": "Coca Cola", "createdAt": "2025-05-12 13:18:17", "updatedAt": "2025-05-12 13:18:17" },
      { "id": "15396ee0-08ea-3e6a-b573-095c1a9b5dc7", "name": "Almendras con vainilla", "client": "Coca Cola", "createdAt": "2025-05-12 13:19:25", "updatedAt": "2025-05-12 13:19:25" },
      { "id": "2d8ddbc2-af75-3d76-928a-985159e0e40b", "name": "Amendoa Baunilha", "client": "Coca Cola", "createdAt": "2025-06-26 10:45:59", "updatedAt": "2025-06-26 10:45:59" },
      { "id": "65a5ff92-13b5-3455-b1c3-af71f53af977", "name": "Amendoa Cafe", "client": "Coca Cola", "createdAt": "2025-06-26 10:46:20", "updatedAt": "2025-06-26 10:46:20" },
      { "id": "171f6ae1-452d-391f-a3af-71280cce576f", "name": "Amêndoa", "client": "Coca Cola", "createdAt": "2026-02-06 19:18:00", "updatedAt": "2026-02-06 19:18:00" },
      { "id": "2f22a9a0-4865-3fb7-b79e-486350363c22", "name": "Anana", "client": "Coca Cola", "createdAt": "2025-05-12 13:19:55", "updatedAt": "2025-05-12 13:19:55" },
      { "id": "f5ca8d3a-9832-318b-9730-668428dca158", "name": "Anana Mandarina", "client": "Coca Cola", "createdAt": "2025-05-12 13:20:49", "updatedAt": "2025-05-12 13:20:49" },
      { "id": "48d2c95e-429e-3bd5-b8a5-862e610d8451", "name": "Anana Tropic", "client": "Coca Cola", "createdAt": "2025-03-27 21:48:49", "updatedAt": "2025-03-27 21:48:49" },
      { "id": "3e6b2395-9b02-3024-b742-39445913fdb1", "name": "Antiacidos", "client": "Bayer", "createdAt": "2025-01-21 14:57:39", "updatedAt": "2025-01-21 14:57:39" },
      { "id": "adc4adb8-8180-389f-ab19-6d6eb0571f7f", "name": "Antihistaminicos", "client": "Bayer", "createdAt": "2025-01-21 14:57:39", "updatedAt": "2025-01-21 14:57:39" },
      { "id": "19776e0f-92fd-3496-894f-86a1415f922c", "name": "Antiseptico para heridas", "client": "Bayer", "createdAt": "2025-01-21 14:57:41", "updatedAt": "2025-01-21 14:57:41" },
      { "id": "7ba23554-6899-339a-86fc-6b62b8beb099", "name": "Aromas Naturales", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "0cf6577f-6ae0-3a26-b624-9bb8924c2118", "name": "Aromas STD", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "60ba4b21-e1c1-3085-acec-7010bd65d6a7", "name": "ARTD", "client": "Coca Cola", "createdAt": "2025-05-12 14:05:24", "updatedAt": "2025-05-12 14:05:24" },
      { "id": "e969fb49-a117-3ca4-944c-0d0df1de3ba4", "name": "Aura Pink Magnolia", "client": "Client 21", "createdAt": "2025-10-07 14:29:13", "updatedAt": "2025-10-07 14:29:13" },
      { "id": "ef7afa44-bd14-3784-9c52-7e90f6b3a6ba", "name": "Avalon Hill", "client": "Hasbro", "createdAt": "2024-03-31 20:35:07", "updatedAt": "2024-03-31 20:35:07" },
      { "id": "1f9545a8-0344-3ed9-a57d-554dac2a74b8", "name": "Aveia", "client": "Coca Cola", "createdAt": "2025-06-26 10:46:36", "updatedAt": "2025-06-26 10:46:36" },
      { "id": "046e1bd3-9c50-3e77-86a8-dfbdbd1a5d0c", "name": "Açaí e Guaraná", "client": "Coca Cola", "createdAt": "2026-02-06 18:37:51", "updatedAt": "2026-02-06 18:37:51" },
      { "id": "81fced09-326b-36f6-90ad-902043a46a1a", "name": "Baby Alive", "client": "Hasbro", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "8b557448-37fa-4407-b0d7-b6c488612484", "name": "Baby Formula", "client": "Client 01", "createdAt": "2026-04-20 23:53:07", "updatedAt": "2026-04-22 11:54:52" },
      { "id": "34e1248c-aa2a-3b0e-848b-bccd4630baa4", "name": "Bacon", "client": "Client 32", "createdAt": "2025-12-22 12:59:55", "updatedAt": "2025-12-22 12:59:55" },
      { "id": "25839ae1-0fdc-36e3-a769-9ffe36f838c8", "name": "Baileys", "client": "Client 23", "createdAt": "2024-03-31 20:35:06", "updatedAt": "2024-03-31 20:35:06" },
      { "id": "51a2d5d2-3f45-3c02-a754-e22955bba5c8", "name": "Bailyes", "client": "Client 23", "createdAt": "2024-05-06 15:38:55", "updatedAt": "2024-05-06 15:38:55" },
      { "id": "4d7f6b67-3623-4db7-9084-4a1840d42a3e", "name": "Baking Mixes", "client": "Client 01", "createdAt": "2026-04-23 19:11:58", "updatedAt": "2026-04-23 19:11:58" },
      { "id": "7779ad8c-46dd-3087-bead-300d48fb201d", "name": "Balsamic", "client": "Client 17", "createdAt": "2024-08-06 12:36:13", "updatedAt": "2024-08-06 12:36:13" },
      { "id": "b13104d4-e898-3559-883d-7bc00d9c2390", "name": "Bars Mini", "client": "Perfetti Van Melle", "createdAt": "2025-04-03 20:42:48", "updatedAt": "2025-04-03 20:42:48" },
      { "id": "8964979d-73e4-3bd6-89ee-d3a1655f50eb", "name": "Bars Singles", "client": "Perfetti Van Melle", "createdAt": "2025-04-03 20:41:04", "updatedAt": "2025-04-03 20:41:04" },
      { "id": "130c3ebb-0a81-3053-b731-b9325a1ed0dd", "name": "Battleship", "client": "Hasbro", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "d0c75352-f854-3ade-9198-155a59ff829c", "name": "Bean coffee", "client": "JDE", "createdAt": "2025-02-13 10:46:11", "updatedAt": "2025-02-14 09:05:44" },
      { "id": "339f9efb-c79f-3d91-90fe-0e5eb8789b4f", "name": "Beauty and Weelbeing", "client": "Client 30bb604f", "createdAt": "2024-04-12 13:48:00", "updatedAt": "2024-04-12 13:48:00" },
      { "id": "2768e905-1277-3bba-99f4-cf19e4def33b", "name": "BEBIDAS AROMATIZADAS", "client": "Client 40", "createdAt": "2025-07-31 13:54:48", "updatedAt": "2025-07-31 13:54:48" },
      { "id": "af21c5df-0bec-341c-a870-e748b4eca746", "name": "Bebidas De Cereales, Semillas Y Vegetales", "client": "Coca Cola", "createdAt": "2025-05-12 14:06:19", "updatedAt": "2025-05-12 14:06:19" },
      { "id": "54278e4e-d129-333c-b5fe-255f3509a76f", "name": "Bebidas De Jugo", "client": "Coca Cola", "createdAt": "2025-05-12 14:06:50", "updatedAt": "2025-05-12 14:06:50" },
      { "id": "bbab6de8-31cf-3050-a09a-4756ef89b207", "name": "Bebidas Hidratantes", "client": "Coca Cola", "createdAt": "2025-05-12 14:09:20", "updatedAt": "2025-05-12 14:09:20" },
      { "id": "314febb9-bfe7-3b65-96d0-ea3aa73062e4", "name": "Beer", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:06", "updatedAt": "2024-03-31 20:35:06" },
      { "id": "d8c08292-38ed-3f92-8f70-1648b668f688", "name": "Bell's", "client": "Client 23", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "c25edc19-f723-3631-86fe-3650c5b1ae30", "name": "Belts", "client": "Perfetti Van Melle", "createdAt": "2025-04-03 20:42:01", "updatedAt": "2025-04-03 20:42:01" },
      { "id": "52c9760a-b2fb-3aa9-b842-04e4febda982", "name": "Bertolli  Extra Virgin", "client": "Client 17", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "26ac6674-284f-3e6e-8c66-8151bd4debd7", "name": "Bertolli Balsamic", "client": "Client 17", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "3efef419-9d2e-38db-9423-8ef89615c6a5", "name": "Bertolli Classic", "client": "Client 17", "createdAt": "2024-03-31 20:34:59", "updatedAt": "2024-03-31 20:34:59" },
      { "id": "a6b0f3bb-2725-3f55-a40f-314688105ddd", "name": "Beverages", "client": "Client 42", "createdAt": "2026-01-21 11:43:00", "updatedAt": "2026-01-21 11:43:00" },
      { "id": "42c542df-1d48-34ec-b451-705ad48c19ad", "name": "Beyblade", "client": "Hasbro", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "a8d40ba4-b575-32ce-bb25-a624524e4a32", "name": "Bid", "client": "Hasbro", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "a49a416b-7d66-3573-86aa-7c2d6c23b731", "name": "Bites", "client": "Perfetti Van Melle", "createdAt": "2025-04-03 20:44:16", "updatedAt": "2025-04-03 20:44:16" },
      { "id": "072599c7-c77a-3e50-b9e2-e25d0d510ee9", "name": "Bites Filled", "client": "Perfetti Van Melle", "createdAt": "2025-04-03 20:43:41", "updatedAt": "2025-04-03 20:43:41" },
      { "id": "a4df85b5-87c8-3779-82bf-7adfe7dd8c67", "name": "Black", "client": "Client 17", "createdAt": "2024-08-06 12:36:13", "updatedAt": "2024-08-06 12:36:13" },
      { "id": "29097d30-73fa-3aa8-9f72-e12d519e3ed8", "name": "Black & White", "client": "Client 23", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "f226c57a-c023-38d5-9886-de1fae818700", "name": "Black Sliced", "client": "Client 17", "createdAt": "2024-08-06 12:36:15", "updatedAt": "2024-08-06 12:36:15" },
      { "id": "6d1ce013-5de9-3e17-a386-15dd75b02453", "name": "Black tea", "client": "JDE", "createdAt": "2025-02-14 14:34:27", "updatedAt": "2025-02-14 14:34:27" },
      { "id": "cb0dcccf-f868-34d8-b89e-c2116f1bfb7a", "name": "Blue Cheese Stuffed", "client": "Client 17", "createdAt": "2024-08-06 12:36:13", "updatedAt": "2024-08-06 12:36:13" },
      { "id": "412c4e8e-4fd1-3e13-a2a9-471c9fe42431", "name": "Body Lotion & Cream Mixed", "client": "Client 21", "createdAt": "2026-04-06 13:21:31", "updatedAt": "2026-04-06 13:21:31" },
      { "id": "64bd888c-b458-30fa-81ec-34554d5a969a", "name": "Bolleria", "client": "Client 11", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "8ae25ec1-76ee-3b8a-871e-5183239b3e63", "name": "Bolsas para alimentos", "client": "Client 26", "createdAt": "2024-09-18 13:18:01", "updatedAt": "2024-09-18 13:18:01" },
      { "id": "c0f18154-f0ca-3fa2-899a-eaf34605d346", "name": "Bop It", "client": "Hasbro", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "49030ae8-d73f-31d2-8811-4e2896c38f85", "name": "Bulleit", "client": "Client 23", "createdAt": "2024-03-31 20:35:07", "updatedAt": "2024-03-31 20:35:07" },
      { "id": "c7b6164e-e02d-3592-89aa-6bdb167bef62", "name": "Burgers", "client": "Client 32", "createdAt": "2025-12-22 12:59:32", "updatedAt": "2025-12-22 12:59:32" },
      { "id": "613c1e7e-6d74-395f-a578-9b2669d1cba7", "name": "C&C", "client": "Client 42", "createdAt": "2025-09-29 19:20:04", "updatedAt": "2025-09-29 19:20:04" },
      { "id": "7526c7f1-204b-382e-8ae3-0d87a6d56cb1", "name": "Cacao", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "d73b60af-2717-3eac-92d7-0ae187e24f53", "name": "Cafe", "client": "Coca Cola", "createdAt": "2025-05-12 13:21:35", "updatedAt": "2025-05-12 13:21:35" },
      { "id": "9d5501a5-85db-38b7-9ed7-ee75e55b2fe6", "name": "Caju", "client": "Coca Cola", "createdAt": "2025-06-26 10:46:59", "updatedAt": "2025-06-26 10:46:59" },
      { "id": "4d9ea0d7-4cdd-3647-9dd6-98bc33751631", "name": "Candle Mixed", "client": "Client 21", "createdAt": "2026-04-06 13:21:13", "updatedAt": "2026-04-06 13:21:13" },
      { "id": "77bec124-8047-330e-a5ed-1758cdeacdc0", "name": "Caol Ila", "client": "Client 23", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "22a92e5c-0367-3e8d-892f-17d38016576d", "name": "Capsules coffee", "client": "JDE", "createdAt": "2025-02-13 10:45:42", "updatedAt": "2025-02-14 09:05:22" },
      { "id": "16aa0b48-7217-322e-a658-3e4f8e9198ab", "name": "Captain Morgan ", "client": "Client 23", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "ae22c532-a517-3028-ab2e-41ede6680c60", "name": "Cara De Papa", "client": "Hasbro", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "fe751fa6-3216-38d5-bfd8-501272b965d2", "name": "Carapelli", "client": "Client 17", "createdAt": "2024-03-31 20:35:07", "updatedAt": "2024-03-31 20:35:07" },
      { "id": "108dc002-a206-3852-be3d-ce86d38ae264", "name": "Carapelli Extra Virgin", "client": "Client 17", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "136a9402-1a6c-30cc-9d40-ab4d6ef977c9", "name": "Caras y Gestos", "client": "Hasbro", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "d076da87-b7a2-39c6-b34d-6dbd08c505f9", "name": "Carbonell", "client": "Client 17", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "7841b6b2-9631-3b4a-948c-53b6715415eb", "name": "Carbonell Classic", "client": "Client 17", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "731c5a9a-2074-3c8e-88d7-497e5e032a8b", "name": "Carbonell Extra Virgin", "client": "Client 17", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "8624fe20-0eba-33e2-a37d-4e0b7b6814a1", "name": "Carbonell Olives", "client": "Client 17", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "8e1a8fab-1839-349f-b217-0f2887bf97c9", "name": "Cardhu", "client": "Client 23", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "c07e4c42-64c0-31a0-b493-ce3e33541970", "name": "Casa Di Mama", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "ca3eca52-92fd-35b9-97eb-a6f1bb5da7fa", "name": "Cereal", "client": "JDE", "createdAt": "2025-03-24 11:31:02", "updatedAt": "2025-03-24 11:31:02" },
      { "id": "a4518e8d-4191-3dc1-9498-b75d860fc5fa", "name": "Cereals", "client": "Client 18", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "f33a8ff3-3066-30b2-86b0-c958bedecec6", "name": "Cerveza", "client": "Client 16", "createdAt": "2024-03-31 20:35:01", "updatedAt": "2024-03-31 20:35:01" },
      { "id": "90bd1649-1fc2-3dae-bde8-728d30cda6c7", "name": "CHEETOS_20B", "client": "Client 42", "createdAt": "2025-09-16 13:15:13", "updatedAt": "2025-09-16 13:15:13" },
      { "id": "ebeeb81a-6459-33f5-b353-67494307bd06", "name": "CHEETOS_30B", "client": "Client 42", "createdAt": "2025-09-16 13:18:18", "updatedAt": "2025-09-16 13:18:18" },
      { "id": "5d1f6a1f-2d26-3ef6-b803-e6f06c1d2d8f", "name": "CHEETOS_5B", "client": "Client 42", "createdAt": "2025-09-16 13:18:41", "updatedAt": "2025-09-16 13:18:41" },
      { "id": "d3d6b84c-d9cc-3f4c-a5cf-d2ca9089ac33", "name": "CHEETOS_PUFF_20B", "client": "Client 42", "createdAt": "2025-09-16 13:19:28", "updatedAt": "2025-09-16 13:19:28" },
      { "id": "f2163aa6-0b74-41de-9012-2249b74ce9e2", "name": "Chicle", "client": "Coca Cola", "createdAt": "2026-06-16 14:11:29", "updatedAt": "2026-06-16 14:11:29" },
      { "id": "a8c94fd1-0fdb-33c5-89d2-5cd7c50ee7ce", "name": "Chincheando", "client": "Hasbro", "createdAt": "2024-03-31 20:35:05", "updatedAt": "2024-03-31 20:35:05" },
      { "id": "90931084-70ed-31fb-a62b-8e93797a090b", "name": "Chips", "client": "Client 18", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "10aa94e1-0d80-3097-abf1-b20e150e91f0", "name": "Chocolate", "client": "Coca Cola", "createdAt": "2025-06-26 10:47:21", "updatedAt": "2025-06-26 10:47:21" },
      { "id": "ee0bdafd-e083-3879-a806-0d1adb1ebc97", "name": "Chups Chups", "client": "Perfetti Van Melle", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "18bb15d7-4746-3e35-be4c-20fcf9b7d6ab", "name": "Cider", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "acf6a375-56f0-33c9-8eba-afcf3598c0f1", "name": "Ciroc ", "client": "Client 23", "createdAt": "2024-03-31 20:35:04", "updatedAt": "2024-03-31 20:35:04" },
      { "id": "b10c0c59-2df7-3449-8a71-1a6547d3ff1e", "name": "Citrus", "client": "Coca Cola", "createdAt": "2025-03-14 17:51:59", "updatedAt": "2025-03-14 17:51:59" },
      { "id": "4911002d-8641-35bb-b171-59166e1bf04e", "name": "Citrus Kick", "client": "Coca Cola", "createdAt": "2026-02-04 14:59:25", "updatedAt": "2026-02-04 14:59:25" },
      { "id": "7db58787-dd53-3909-b46f-ee0d3808e1d4", "name": "Citrus Maracuja", "client": "Coca Cola", "createdAt": "2025-06-26 10:47:53", "updatedAt": "2025-06-26 10:47:53" },
      { "id": "42ffe229-1600-3f5b-bd7b-6f492b9692bf", "name": "Citrus Passion Fruit", "client": "Coca Cola", "createdAt": "2026-01-16 12:50:25", "updatedAt": "2026-01-16 12:50:25" },
      { "id": "7e4b0911-a0c9-32f1-b06b-a37bd0ee9e0d", "name": "Classic", "client": "Coca Cola", "createdAt": "2026-02-04 14:58:09", "updatedAt": "2026-02-04 14:58:09" },
      { "id": "300e0e12-c306-3de4-a8b2-2d57289cb71c", "name": "Cleanser", "client": "Cosnova", "createdAt": "2025-09-04 10:34:20", "updatedAt": "2025-09-04 10:34:20" },
      { "id": "f382bd09-2371-3273-907e-189ce550996f", "name": "Cleanser Mixed", "client": "Client 21", "createdAt": "2026-04-06 13:22:00", "updatedAt": "2026-04-06 13:22:00" },
      { "id": "3b429b0e-a7e4-3fe5-9ed9-ba96bd00babe", "name": "Club Soda", "client": "Coca Cola", "createdAt": "2025-06-26 10:48:16", "updatedAt": "2025-06-26 10:48:16" },
      { "id": "17b514aa-1e03-32fe-b549-043901d55090", "name": "Clue", "client": "Hasbro", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "16f574f0-e4e4-35a0-9127-aa5fb06c8ab1", "name": "Cluedo", "client": "Hasbro", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "4541c724-ad01-3f0f-9cee-8570d4bdc65b", "name": "Coberturas", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:02", "updatedAt": "2024-03-31 20:35:02" },
      { "id": "5a95c69f-7728-35ba-ab32-87c092133e3a", "name": "Coca Cola Trademark", "client": "Coca Cola", "createdAt": "2025-05-12 14:09:45", "updatedAt": "2025-05-12 14:09:45" },
      { "id": "1e6ecc28-4324-3354-af23-7669ad09871d", "name": "Coco", "client": "Coca Cola", "createdAt": "2026-02-09 16:56:11", "updatedAt": "2026-02-09 16:56:11" },
      { "id": "0694e083-ce2a-3df9-b586-215f8307e1ff", "name": "Coco-Limon", "client": "Coca Cola", "createdAt": "2025-05-16 17:24:04", "updatedAt": "2025-05-16 17:24:04" },
      { "id": "f3d6dc85-81ac-4784-bce0-ab3f6c041389", "name": "Coffee Beans", "client": "Client 01", "createdAt": "2026-04-20 23:57:13", "updatedAt": "2026-04-22 11:55:09" },
      { "id": "102813ca-eea6-30cf-ab4a-c80e8c3e2197", "name": "Cola", "client": "Coca Cola", "createdAt": "2025-03-14 17:49:08", "updatedAt": "2025-03-14 17:49:08" },
      { "id": "22b56f63-2311-3908-a6bb-cea4320c906f", "name": "Cola Roja", "client": "Coca Cola", "createdAt": "2025-09-26 15:03:08", "updatedAt": "2025-09-26 15:03:08" },
      { "id": "7ba46e88-8eb3-3343-8226-4a784305ed13", "name": "Colas", "client": "Coca Cola", "createdAt": "2026-02-04 14:59:09", "updatedAt": "2026-02-04 14:59:09" },
      { "id": "0a5cb479-38f3-3a3f-b9e7-6e9d9683e4ba", "name": "Colicos Menstruales", "client": "Bayer", "createdAt": "2025-01-21 14:57:41", "updatedAt": "2025-01-21 14:57:41" },
      { "id": "c961718c-eba2-3ed3-b343-b029b0f8e20e", "name": "Colorantes", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "9e8651e0-a292-3b40-b41b-d61409244280", "name": "Comienza La Aventura", "client": "Hasbro", "createdAt": "2024-03-31 20:35:03", "updatedAt": "2024-03-31 20:35:03" },
      { "id": "c9af71c0-35f2-3e92-a400-fb2d83ed48fa", "name": "Con gas", "client": "Coca Cola", "createdAt": "2025-05-16 18:23:18", "updatedAt": "2025-05-16 18:23:18" },
      { "id": "864f2aa9-a3c4-30cb-ab09-bfa9f51f6287", "name": "Conecta 4", "client": "Hasbro", "createdAt": "2024-03-31 20:35:05", "updatedAt": "2024-03-31 20:35:05" },
      { "id": "678d8aef-9f23-3e42-8a04-303263a0f612", "name": "CONFECTIONARY", "client": "Client 42", "createdAt": "2025-03-14 18:43:23", "updatedAt": "2025-03-14 18:43:23" },
      { "id": "78a5a707-b083-4683-b3a4-40620df9505a", "name": "Consumer Care", "client": "Client 01", "createdAt": "2026-04-20 23:49:19", "updatedAt": "2026-04-20 23:49:19" },
      { "id": "b8c8c991-2c26-38a2-9104-e70e4abee3fd", "name": "Cookies", "client": "Client 42", "createdAt": "2025-02-26 21:46:11", "updatedAt": "2025-02-26 21:46:11" },
      { "id": "a3fcdfa2-7b56-37cc-b491-c11d5b5763f1", "name": "Cooking", "client": "Client 17", "createdAt": "2024-08-06 12:36:13", "updatedAt": "2024-08-06 12:36:13" },
      { "id": "8c2a50de-0b54-4a2f-8f11-770e75f69d51", "name": "Cooking Aids", "client": "Client 01", "createdAt": "2026-04-23 19:20:20", "updatedAt": "2026-04-23 19:20:20" },
      { "id": "a4dd416f-199f-38cb-8b72-1d703c379474", "name": "Cool Citrus", "client": "Coca Cola", "createdAt": "2026-02-04 14:59:37", "updatedAt": "2026-02-04 14:59:37" },
      { "id": "667a46fb-3fef-3f21-8d78-bfee342e14f0", "name": "Core Functional - chewies", "client": "Perfetti Van Melle", "createdAt": "2025-04-21 19:17:35", "updatedAt": "2025-04-21 19:17:35" },
      { "id": "07b9d08b-dd46-3c55-9628-237244f4d7dc", "name": "Core Functional - cough drops", "client": "Perfetti Van Melle", "createdAt": "2025-04-17 17:04:05", "updatedAt": "2025-04-17 17:04:05" },
      { "id": "84af7389-5579-331e-86fa-bf4e3ea6f2a6", "name": "Core Functional - powermints", "client": "Perfetti Van Melle", "createdAt": "2025-04-17 17:05:21", "updatedAt": "2025-04-17 17:05:21" },
      { "id": "d10b2476-2b2a-35a0-afd7-45bbefaaaecc", "name": "Core Functional - tea", "client": "Perfetti Van Melle", "createdAt": "2025-04-21 19:22:34", "updatedAt": "2025-04-21 19:22:34" },
      { "id": "e64868e8-8ea0-36bb-b9ea-ae6b8e12c143", "name": "Core Sweet - gum", "client": "Perfetti Van Melle", "createdAt": "2025-04-17 17:05:40", "updatedAt": "2025-04-17 17:05:40" },
      { "id": "7a2e35f1-7328-3d55-b61b-0b38b7e0a79a", "name": "Core Sweet - indulgence", "client": "Perfetti Van Melle", "createdAt": "2025-04-21 19:20:23", "updatedAt": "2025-04-21 19:20:23" },
      { "id": "bc050c61-8482-3f4e-93be-328ed509c886", "name": "Core Sweet - lollies", "client": "Perfetti Van Melle", "createdAt": "2025-04-21 19:19:37", "updatedAt": "2025-04-21 19:19:37" },
      { "id": "625d97f4-d4fa-352e-981a-03dee9ec7e7d", "name": "CPD", "client": "Loreal", "createdAt": "2024-03-31 20:35:00", "updatedAt": "2024-03-31 20:35:00" },
      { "id": "acffeffc-8c40-3155-b00e-2ed0f6d478da", "name": "Craft and Specialty Beer", "client": "Coca Cola", "createdAt": "2024-03-31 20:35:07", "updatedAt": "2024-03-31 20:35:07" },
      { "id": "4de6c915-61b7-4a68-b1d4-986627ffc56b", "name": "Creamer", "client": "Client 01", "createdAt": "2026-04-21 00:03:16", "updatedAt": "2026-04-22 11:54:38" },
      { "id": "3e35aa4b-2651-3ab9-97c7-385e1acdfe9e", "name": "Crema Antimicotica para pies", "client": "Bayer", "createdAt": "2025-01-21 14:57:40", "updatedAt": "2025-01-21 14:57:40" }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "client",
        "label": "Client",
        "type": "select",
        "required": true,
        "options": [
          "Client options loaded from autocomplete API"
        ]
      }
    ]
  },
  "client-categories": {
    "key": "client-categories",
    "title": "Client categories",
    "addLabel": "Add client category",
    "search": "Search client categories by name",
    "filters": [
      "Name",
      "Client",
      "Created at",
      "Updated at"
    ],
    "total": 696,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Client",
        "key": "client"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      { "id": "d120092f-e547-3c92-952d-9fefd601709f", "name": "Essential", "client": "Perfetti Van Melle", "createdAt": "2025-03-25 15:36:02", "updatedAt": "2025-03-25 15:36:02" },
      { "id": "7e2c0996-befc-3a4e-adaf-ba37693e27a1", "name": "Rum", "client": "Client 23", "createdAt": "2024-03-01 10:11:56", "updatedAt": "2024-03-01 10:11:56" },
      { "id": "965fafee-4c2a-3e8f-b581-c704abdc72a8", "name": "Liquor", "client": "Client 23", "createdAt": "2024-03-01 10:11:56", "updatedAt": "2024-03-01 10:11:56" },
      { "id": "842361b5-e1dd-3d9d-8b8b-7a9d010ecae6", "name": "Beer", "client": "Client 23", "createdAt": "2024-03-01 10:11:56", "updatedAt": "2024-03-01 10:11:56" },
      { "id": "0ef1caed-1192-33ee-bbd3-3984f1f8dcd8", "name": "Whisky", "client": "Client 23", "createdAt": "2024-03-01 10:11:56", "updatedAt": "2024-03-01 10:11:56" },
      { "id": "dad748f7-4a12-30a6-9bbe-723f86d51d89", "name": "Gin", "client": "Client 23", "createdAt": "2024-03-01 10:11:57", "updatedAt": "2024-03-01 10:11:57" },
      { "id": "f90b3d35-ae42-3c7c-87d7-ae95faf4006f", "name": "Juegos Didácticos", "client": "Hasbro", "createdAt": "2024-03-31 20:38:43", "updatedAt": "2024-03-31 20:38:43" },
      { "id": "c75c3f53-9b63-3c91-9d64-c715a2923148", "name": "Juegos de Mesa", "client": "Hasbro", "createdAt": "2024-03-31 20:38:43", "updatedAt": "2024-03-31 20:38:43" },
      { "id": "71ca5825-c92e-3bd8-a1a2-eb9c6c988f1a", "name": "Mascara", "client": "Cosnova", "createdAt": "2024-03-31 20:38:43", "updatedAt": "2024-03-31 20:38:43" },
      { "id": "3f8a48e7-092c-3205-b750-c900e54ffe58", "name": "Lipgloss", "client": "Cosnova", "createdAt": "2024-03-31 20:38:43", "updatedAt": "2024-03-31 20:38:43" },
      { "id": "08740ef6-d935-354b-bfc3-ca7cb1d61717", "name": "Home Appliances", "client": "Spectrum Brands", "createdAt": "2024-03-31 20:38:43", "updatedAt": "2024-03-31 20:38:43" },
      { "id": "0b60b8f5-935d-3e57-b38b-3d7fe52102e6", "name": "Skincare", "client": "Loreal", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "67d966e6-7427-3667-9b22-3a012f76dee3", "name": "Lanzadores", "client": "Hasbro", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "4ea2ebb0-8480-3f1a-87af-3f02ad5cfa21", "name": "Beer", "client": "Coca Cola", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "104ad07f-d220-379d-a090-18ea5382db53", "name": "Lip Specials ", "client": "Cosnova", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "a64e38ce-5fb9-39ef-bbb0-e49cd8cd6b9f", "name": "Cooking Oil", "client": "Client 17", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "1dd4ef6e-8acc-3b62-a3d9-ba8c127d859a", "name": "Eye Specials", "client": "Cosnova", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "254715a4-3497-369c-a438-c0eef8dfb2ec", "name": "Blush + Highlighter", "client": "Cosnova", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "ce0d8f7d-079f-33b1-b246-09d1364cdbf7", "name": "Face Set", "client": "Cosnova", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "2d4d2e88-aaa2-35ff-b565-ec86a171355c", "name": "Lipstick", "client": "Cosnova", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "7271a783-f609-36aa-b701-0e561c6ce091", "name": "Chocolates", "client": "Mattel", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "7dc86d76-b2fc-3dc0-a3f7-b3a67f26995d", "name": "Personal Care", "client": "Spectrum Brands", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "6c21d4ab-747b-3dd8-b6e1-f229e728a8c9", "name": "Té", "client": "Coca Cola", "createdAt": "2025-05-27 15:50:13", "updatedAt": "2025-05-27 15:50:13" },
      { "id": "0c58e9c8-3a81-31c3-9708-7207600c19b6", "name": "Make-up", "client": "Cosnova", "createdAt": "2024-03-31 20:38:46", "updatedAt": "2024-03-31 20:38:46" },
      { "id": "ba484c13-0cf0-384f-9450-9422d2160623", "name": "Jellies", "client": "Perfetti Van Melle", "createdAt": "2024-05-12 21:32:30", "updatedAt": "2024-05-12 21:32:30" },
      { "id": "bea19896-a268-3621-94a8-590b481ef851", "name": "Gum", "client": "Perfetti Van Melle", "createdAt": "2024-05-12 21:33:32", "updatedAt": "2024-05-12 21:33:32" },
      { "id": "99e8255a-c06d-3642-9143-7c58106619d0", "name": "Concealer", "client": "Cosnova", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "82762b79-2305-3f8e-8e86-11ef7a0fdc4d", "name": "Fragance", "client": "Loreal", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "82ae9b82-c6a5-37ab-9da7-f2b344d0937c", "name": "Chocolate infantil", "client": "Mattel", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "46bd9bbe-1144-387b-92f1-0032126a0320", "name": "Cake", "client": "Coca Cola", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "8e4b4b4e-566c-35f2-80a5-ec727cbae329", "name": "Vehículo de Juguete", "client": "Mattel", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-11-18 11:09:58" },
      { "id": "65cdc80e-3f0c-3ee6-9690-a48e38062131", "name": "Pista de Juguete", "client": "Mattel", "createdAt": "2024-11-18 11:18:26", "updatedAt": "2024-11-18 11:18:26" },
      { "id": "79918a68-5419-3d3a-82ff-83aa19cbc0ae", "name": "Champagne Moët Impérial", "client": "Client 10", "createdAt": "2024-10-21 15:37:56", "updatedAt": "2024-11-21 16:30:29" },
      { "id": "7388c96c-2cc9-31ec-9a74-95a706a2af9c", "name": "Chewing-gum", "client": "Perfetti Van Melle", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "92fdd84e-9841-3bc7-9a1c-4994f4759cbc", "name": "Eyeshadow", "client": "Cosnova", "createdAt": "2024-03-31 20:38:46", "updatedAt": "2024-03-31 20:38:46" },
      { "id": "387e4aa8-1f81-3c71-9999-d92eda8c9ebb", "name": "Makeup", "client": "Loreal", "createdAt": "2024-03-31 20:38:46", "updatedAt": "2024-03-31 20:38:46" },
      { "id": "dde11dcb-53b7-3d1e-a2d0-f8b605d73ce4", "name": "Olive Oil", "client": "Client 17", "createdAt": "2024-03-31 20:38:47", "updatedAt": "2024-03-31 20:38:47" },
      { "id": "f3ae2294-c5ac-3db8-9331-b87eab3e6e07", "name": "Dry", "client": "Affinity Petcare", "createdAt": "2024-04-12 10:21:18", "updatedAt": "2024-04-12 10:21:18" },
      { "id": "52d1368b-7f78-3e3d-9d70-a8e7278bfed4", "name": "Wet", "client": "Affinity Petcare", "createdAt": "2024-04-12 10:23:38", "updatedAt": "2024-04-12 10:23:38" },
      { "id": "c6dc3949-dcf4-3b72-8f06-184a0a572e5f", "name": "Fragances", "client": "Client 21", "createdAt": "2024-05-06 14:22:45", "updatedAt": "2024-05-06 14:22:45" },
      { "id": "626618cc-d869-3872-afa5-f8d2fecc52cb", "name": "Home Scents", "client": "Client 21", "createdAt": "2024-05-06 14:23:10", "updatedAt": "2024-05-06 14:23:10" },
      { "id": "9189c35f-b0c1-3be9-be07-d33daedf7928", "name": "Chewy", "client": "Perfetti Van Melle", "createdAt": "2024-05-12 21:33:18", "updatedAt": "2024-05-12 21:33:18" },
      { "id": "e4f39233-d4c6-34f0-ae00-5df47b5de633", "name": "Muñeca", "client": "Mattel", "createdAt": "2024-03-31 20:38:46", "updatedAt": "2024-11-18 11:11:39" },
      { "id": "a7eb47af-514c-3b8c-8dbf-efb50176f606", "name": "Soft Candy", "client": "Perfetti Van Melle", "createdAt": "2024-12-30 13:26:18", "updatedAt": "2024-12-30 13:26:18" },
      { "id": "7bc08f1f-500c-3498-a5ee-25c97909f27e", "name": "Allergy", "client": "Bayer", "createdAt": "2025-01-21 14:35:44", "updatedAt": "2025-01-21 14:35:44" },
      { "id": "5b888d82-6625-3d9f-9d55-52b6cff0f652", "name": "Analgesics", "client": "Bayer", "createdAt": "2025-01-21 14:35:44", "updatedAt": "2025-01-21 14:35:44" },
      { "id": "76045042-cbab-38b4-97b3-db0d8079c79c", "name": "Respiratory", "client": "Bayer", "createdAt": "2025-01-21 14:35:44", "updatedAt": "2025-01-21 14:35:44" },
      { "id": "fdd803c7-3013-3579-a521-af45111f7b68", "name": "Tea", "client": "JDE", "createdAt": "2025-02-13 15:14:38", "updatedAt": "2025-02-13 15:14:38" },
      { "id": "8f61a4eb-3fc8-38c6-9516-2ca23eac8883", "name": "Coffee", "client": "JDE", "createdAt": "2025-02-13 15:15:09", "updatedAt": "2025-02-13 15:15:09" },
      { "id": "75de052d-08c6-3a3a-b0aa-982416211e0a", "name": "Tortilla Chips", "client": "Client 42", "createdAt": "2025-02-26 21:43:29", "updatedAt": "2025-02-26 21:43:29" },
      { "id": "d54e5dd7-bfb3-33be-a9e9-35d78c4e1953", "name": "Potato Chips", "client": "Client 42", "createdAt": "2025-02-26 21:43:29", "updatedAt": "2025-02-26 21:43:29" },
      { "id": "f8740e81-f18d-3a54-8277-c2ca6910ae20", "name": "Extruded Snacks", "client": "Client 42", "createdAt": "2025-02-26 21:43:29", "updatedAt": "2025-02-26 21:43:29" },
      { "id": "4c53f461-3ad8-387b-b476-ddd0dfbc6171", "name": "Oats", "client": "Client 42", "createdAt": "2025-02-26 21:43:30", "updatedAt": "2025-02-26 21:43:30" },
      { "id": "a2eedcce-bae2-3f6f-8d3c-2d3e074613e7", "name": "Perfumes", "client": "Client 21", "createdAt": "2025-03-11 19:45:37", "updatedAt": "2025-03-11 19:45:37" },
      { "id": "e4f9aa5f-1c76-35a3-a30f-4013325a4a17", "name": "Flour", "client": "Client 42", "createdAt": "2025-03-13 21:48:38", "updatedAt": "2025-03-13 21:48:38" },
      { "id": "a0edac34-fa5e-3066-94ee-b9dd945ea9d2", "name": "Other Salty", "client": "Client 42", "createdAt": "2025-03-13 21:50:54", "updatedAt": "2025-03-13 21:50:54" },
      { "id": "4d643d38-3141-3cd0-9126-95c053bb8e7f", "name": "Core", "client": "Perfetti Van Melle", "createdAt": "2025-03-25 15:36:25", "updatedAt": "2025-03-25 15:36:25" },
      { "id": "6928d145-6691-3f2c-8827-e643861e4c78", "name": "New", "client": "Perfetti Van Melle", "createdAt": "2025-03-25 15:36:52", "updatedAt": "2025-03-25 15:36:52" },
      { "id": "3ceebb4e-67f4-31c1-a4d1-ccf71b2052a6", "name": "Portfolio", "client": "Perfetti Van Melle", "createdAt": "2025-03-25 15:37:22", "updatedAt": "2025-03-25 15:37:22" },
      { "id": "125b7ed1-554b-3de3-91d6-c830c1750ac9", "name": "Soft Pads", "client": "JDE", "createdAt": "2025-03-31 14:13:17", "updatedAt": "2025-03-31 14:13:17" },
      { "id": "bacef173-87f8-3987-b860-b0f5ebc41c5e", "name": "Beans", "client": "JDE", "createdAt": "2025-03-31 10:29:09", "updatedAt": "2025-04-07 16:05:06" },
      { "id": "d587ff5d-3fc8-3396-b3b0-bd5f20235429", "name": "Capsules", "client": "JDE", "createdAt": "2025-03-31 10:29:52", "updatedAt": "2025-04-07 16:05:26" },
      { "id": "7c25bfd3-5522-3fbf-97a6-9e3e0435a7d1", "name": "Straighteners", "client": "Spectrum Brands", "createdAt": "2025-04-08 15:52:39", "updatedAt": "2025-04-08 15:52:39" },
      { "id": "b9ace6ba-8f04-3e31-9ea6-702937a0a399", "name": "Stylers", "client": "Spectrum Brands", "createdAt": "2025-04-08 15:52:52", "updatedAt": "2025-04-08 15:52:52" },
      { "id": "e125112d-b2f6-3dc0-9fd3-c461afdc8b95", "name": "Gaseosa Cola Regular", "client": "Coca Cola", "createdAt": "2025-05-27 15:47:34", "updatedAt": "2025-05-27 15:47:34" },
      { "id": "a442ece8-9471-3dec-b718-f2405eaa9009", "name": "Hidratantes", "client": "Coca Cola", "createdAt": "2025-05-27 15:49:16", "updatedAt": "2025-05-27 15:49:16" },
      { "id": "f5deba68-28ce-37fd-8eca-ceb1b084ff1e", "name": "Jugos y bebida con fruta", "client": "Coca Cola", "createdAt": "2025-05-28 14:55:09", "updatedAt": "2025-05-28 14:55:09" },
      { "id": "ca2eea5b-921a-3d82-b9c4-e971b5fda3d7", "name": "STILLS - Active Hydration", "client": "Coca Cola", "createdAt": "2025-06-26 11:11:32", "updatedAt": "2025-06-26 11:11:32" },
      { "id": "554359cb-4b6f-3f00-9376-9e4f62d76cf7", "name": "SPIRITS", "client": "Client 40", "createdAt": "2025-07-31 13:51:30", "updatedAt": "2025-07-31 13:51:30" },
      { "id": "711647c1-9ea1-3fae-9dcb-e4a69358de86", "name": "100 White", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:16:14", "updatedAt": "2025-09-30 19:16:14" },
      { "id": "e38f62e3-296c-3981-bc1e-456832a3e216", "name": "100er Dose", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:26:09", "updatedAt": "2025-09-30 18:26:09" },
      { "id": "917f285f-cc73-314e-9ea1-b2a046aad74c", "name": "100er Mini Beutel", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:23:59", "updatedAt": "2025-09-30 18:23:59" },
      { "id": "0ce65131-05ec-3f7a-ab35-8f82b5142384", "name": "100er Tray", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:21:23", "updatedAt": "2025-09-30 18:21:23" },
      { "id": "443abcc7-ff3b-3e5d-8884-534c89958746", "name": "10er Beutel 12g", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:21:44", "updatedAt": "2025-09-30 18:21:44" },
      { "id": "4513dc62-8200-37b9-b40c-6d29ead08a11", "name": "11er Beutel", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:20:40", "updatedAt": "2025-09-30 18:20:40" },
      { "id": "7be8f4d2-10d0-315e-929c-0900909d8b94", "name": "120er Beutel", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:26:28", "updatedAt": "2025-09-30 18:26:28" },
      { "id": "cd78dc3a-921d-3cbb-9b91-80430b4bd7fe", "name": "150er Beutel", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:12:01", "updatedAt": "2025-09-30 19:12:01" },
      { "id": "dd634219-ac5a-3f9a-acbc-638686953b8a", "name": "150er Eimer", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:13:12", "updatedAt": "2025-09-30 19:13:12" },
      { "id": "41a58c69-bffd-35da-b4e8-b092b720ed00", "name": "2 Hours", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:16:45", "updatedAt": "2025-09-30 19:16:45" },
      { "id": "0b3b47f0-7372-3b02-abeb-c51ff96facf7", "name": "2 Hours Big Pack", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:16:58", "updatedAt": "2025-09-30 19:16:58" },
      { "id": "cfcd35a3-8362-313e-b2f5-bb11371fe3a6", "name": "21er Beutel", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:20:57", "updatedAt": "2025-09-30 18:20:57" },
      { "id": "96dec3cd-1a8b-3f4e-b0d1-57277dbccf39", "name": "250er Beutel", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:13:44", "updatedAt": "2025-09-30 19:13:44" },
      { "id": "906176b4-669a-3ccc-8120-a0ba28fd060d", "name": "25g mit Zucker", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:19:27", "updatedAt": "2025-09-30 18:19:27" },
      { "id": "e0caf3aa-650b-32ed-9dc7-c6059a08b1ca", "name": "25g ohne Zucker", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:19:42", "updatedAt": "2025-09-30 18:19:42" },
      { "id": "3187c0bc-9483-39c4-a014-f45bd8462d7d", "name": "2h Defensive", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:16:25", "updatedAt": "2025-09-30 19:16:25" },
      { "id": "3653e9a4-04e7-354c-8399-21fe5bbd7be4", "name": "3 Layer", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:15:51", "updatedAt": "2025-09-30 19:15:51" },
      { "id": "c78799fd-0236-3292-a69f-96a020d5b715", "name": "360er Mini Beutel", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:11:48", "updatedAt": "2025-09-30 19:11:48" },
      { "id": "e602f2b4-36c9-3c02-94cd-f5be285fa452", "name": "40er SR", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:15:27", "updatedAt": "2025-09-30 19:15:27" },
      { "id": "6814b2d4-b9bf-37a2-a5b1-438be2715aaf", "name": "50er Dose", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:25:00", "updatedAt": "2025-09-30 18:25:00" },
      { "id": "71733edd-2c22-3b1c-b0ce-17bbf6308f28", "name": "Abarrotes Untables", "client": "Mattel", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "b93a0e6c-7cd8-3f16-8fd7-8acc2d1a7093", "name": "Acai", "client": "Client 25", "createdAt": "2025-09-17 12:40:30", "updatedAt": "2025-09-17 12:40:30" },
      { "id": "a9d46ede-969a-35dc-abb0-182e3873e001", "name": "Accesorios para Muñeca", "client": "Mattel", "createdAt": "2024-11-18 14:45:42", "updatedAt": "2024-11-18 14:45:42" },
      { "id": "4e02cd43-af52-3187-a449-fb88846a1d69", "name": "Accessory", "client": "Client 21", "createdAt": "2025-03-17 14:55:41", "updatedAt": "2025-03-17 14:55:41" },
      { "id": "7aa48740-6c34-31e9-87d5-7dbaf200b266", "name": "Aceitunas", "client": "Client 26", "createdAt": "2024-09-18 13:14:46", "updatedAt": "2024-09-18 13:14:46" },
      { "id": "d727f112-fa67-3aae-ad53-7dfc557e3005", "name": "Acondicionador", "client": "Client 30bb604f", "createdAt": "2024-06-17 15:09:19", "updatedAt": "2024-06-17 15:09:19" },
      { "id": "3a2dc07c-30aa-3a1f-8765-4f5c4c953360", "name": "Aderezos", "client": "Client 26", "createdAt": "2024-09-18 13:14:46", "updatedAt": "2024-09-18 13:14:46" },
      { "id": "5884a705-ea37-3a68-ac9c-6ef2ff746bba", "name": "Adventskalender", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:20:28", "updatedAt": "2025-09-30 18:20:28" },
      { "id": "0dc6daec-e8aa-36d3-bf13-cf9d58322f83", "name": "Agua", "client": "Coca Cola", "createdAt": "2025-08-06 12:58:29", "updatedAt": "2025-08-06 12:58:29" },
      { "id": "caa3269f-799e-3de9-a095-80ec91fb9508", "name": "Agua Con Gas", "client": "Coca Cola", "createdAt": "2025-05-27 15:46:40", "updatedAt": "2025-05-27 15:46:40" },
      { "id": "6c0d7271-b0b6-3b72-8911-f9ea5e4e59a3", "name": "Agua MS", "client": "Coca Cola", "createdAt": "2025-05-15 14:40:26", "updatedAt": "2025-05-15 14:40:26" },
      { "id": "a3ee4c31-76a1-3cb3-a1eb-af3f861b874f", "name": "Agua Saborizada", "client": "Coca Cola", "createdAt": "2025-08-06 13:00:11", "updatedAt": "2025-08-06 13:00:11" },
      { "id": "00af15da-7c36-3d4d-9d48-36fd59ce241d", "name": "Agua saborizada con gas", "client": "Coca Cola", "createdAt": "2025-05-27 15:46:54", "updatedAt": "2025-05-27 15:46:54" },
      { "id": "7382e9a8-2e33-3f88-8c43-1d94dffe8ac6", "name": "Agua Saborizada Sin Gas", "client": "Coca Cola", "createdAt": "2025-05-28 15:00:09", "updatedAt": "2025-05-28 15:00:09" },
      { "id": "ecda5078-ac5a-309c-984d-f1b1da4b9210", "name": "Agua Sin Gas", "client": "Coca Cola", "createdAt": "2025-05-27 15:47:14", "updatedAt": "2025-05-27 15:47:14" },
      { "id": "dde21a1b-2fec-33d4-969c-25d4a20c1259", "name": "Agua SS", "client": "Coca Cola", "createdAt": "2025-05-15 14:41:43", "updatedAt": "2025-05-15 14:41:43" },
      { "id": "221528c4-52d3-4cbf-bb37-b1472f0246b8", "name": "Aguas Plain", "client": "Coca Cola", "createdAt": "2026-06-22 15:54:44", "updatedAt": "2026-06-22 15:54:44" },
      { "id": "72aea556-0410-306e-9434-e46952cb5e1d", "name": "Air Fryers", "client": "Spectrum Brands", "createdAt": "2026-04-02 13:34:01", "updatedAt": "2026-04-02 13:34:01" },
      { "id": "7befe2b7-e07b-32b4-9d14-c1570741b499", "name": "Alcoholic Beverage", "client": "Coca Cola", "createdAt": "2025-03-27 21:41:16", "updatedAt": "2025-03-27 21:41:16" },
      { "id": "d720e107-f1f2-491e-892a-9a9816fc7f72", "name": "All Other Crackers", "client": "Client 42", "createdAt": "2026-06-19 14:12:36", "updatedAt": "2026-06-19 14:12:36" },
      { "id": "c6fda72e-26bd-3aa4-8239-c66e313ea783", "name": "All Other Salty Snack", "client": "Client 42", "createdAt": "2026-01-30 14:16:51", "updatedAt": "2026-01-30 18:20:55" },
      { "id": "42bab3ec-dd23-361e-95be-0a9617bc2931", "name": "Almond-based drink", "client": "Coca Cola", "createdAt": "2025-03-14 17:46:38", "updatedAt": "2025-03-14 17:46:38" },
      { "id": "561b54df-7263-385c-bba5-279ef2b0433e", "name": "AMORA SUGAR FREE", "client": "Client 25", "createdAt": "2025-09-17 18:12:35", "updatedAt": "2025-09-17 18:12:35" },
      { "id": "ab20b8c0-d16e-4ef0-8235-97ce7a761522", "name": "Ancient Grains", "client": "Client 42", "createdAt": "2026-06-19 14:13:35", "updatedAt": "2026-06-19 14:13:35" },
      { "id": "9c975026-e2e4-39fc-b119-4da496fb5607", "name": "Ancillary", "client": "Client 21", "createdAt": "2026-04-06 13:19:50", "updatedAt": "2026-04-06 13:19:50" },
      { "id": "b598232b-8724-3c46-8d9b-d232d5b4376b", "name": "Andadera para Bebés", "client": "Mattel", "createdAt": "2024-11-18 11:14:52", "updatedAt": "2024-11-18 11:14:52" },
      { "id": "fb4ef32b-bef4-3ab9-b16b-d704a0438e08", "name": "Andador para Bebês", "client": "Mattel", "createdAt": "2024-11-25 14:57:47", "updatedAt": "2024-11-25 14:57:47" },
      { "id": "f83c0251-b2c2-3497-8c99-9e2bc24a34b2", "name": "Anis", "client": "Client 33", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "ae511ae3-ccec-3a56-99cf-2e814307afdb", "name": "Aprikose-Erdbeere", "client": "Client 25", "createdAt": "2025-09-17 12:40:30", "updatedAt": "2025-09-17 12:40:30" },
      { "id": "a27744fc-2c42-36d6-8b82-6e23cfd877a4", "name": "ARTD", "client": "Coca Cola", "createdAt": "2025-05-12 14:04:59", "updatedAt": "2025-05-12 14:04:59" },
      { "id": "b7e77374-b638-34ab-8f32-eb8f7b25d544", "name": "Artesana", "client": "Coca Cola", "createdAt": "2025-07-24 14:49:33", "updatedAt": "2025-07-24 14:49:33" },
      { "id": "f141c5ed-d4fc-3c9a-b70a-49bd4962b3fd", "name": "Artesanas", "client": "Coca Cola", "createdAt": "2025-07-24 14:27:50", "updatedAt": "2025-07-24 14:27:50" },
      { "id": "61fb071d-9332-34bb-9c0e-2f67c1ae711a", "name": "Atún", "client": "Client 26", "createdAt": "2024-09-18 13:14:46", "updatedAt": "2024-09-18 13:14:46" },
      { "id": "53d23ce6-13f5-3cdb-beee-e17abc8e61e7", "name": "Baby Care", "client": "Client 17", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "681489bf-42c9-3e71-b506-3dd56e91e32c", "name": "Bacinica para Bebés", "client": "Mattel", "createdAt": "2024-11-18 14:43:13", "updatedAt": "2024-11-18 14:43:13" },
      { "id": "bd0e9631-484d-3a53-8d08-aac5bc44a275", "name": "Baking mixes", "client": "Client 26", "createdAt": "2024-09-18 13:14:46", "updatedAt": "2024-09-18 13:14:46" },
      { "id": "d86a1037-5802-46d1-bbe1-211bebbc5326", "name": "Baking Mixes", "client": "Client 42", "createdAt": "2026-05-18 15:53:13", "updatedAt": "2026-05-18 15:53:13" },
      { "id": "42c0c1ca-cf81-39e3-ac12-b73cbf247d51", "name": "Banheira para Bebês", "client": "Mattel", "createdAt": "2024-11-25 14:57:34", "updatedAt": "2024-11-25 14:57:34" },
      { "id": "8b25137f-6afa-3816-8efd-6ce21a21d1a2", "name": "Barras", "client": "Client 26", "createdAt": "2024-09-18 13:14:48", "updatedAt": "2024-09-18 13:14:48" },
      { "id": "95aaeb60-9c5a-30b5-9e49-c1c94d7eac8b", "name": "Bañera para Bebés", "client": "Mattel", "createdAt": "2024-11-18 11:15:08", "updatedAt": "2024-11-18 11:15:08" },
      { "id": "fbb338d8-6491-3a44-902f-8ec0b8283b99", "name": "BCAA", "client": "Client 02", "createdAt": "2024-12-23 11:16:46", "updatedAt": "2024-12-23 11:16:46" },
      { "id": "eecb9c00-6387-4cce-b41f-c972acfc7e5c", "name": "Bebida Saborizada Larga Duracion", "client": "Coca Cola", "createdAt": "2026-06-16 14:06:22", "updatedAt": "2026-06-16 14:06:22" },
      { "id": "c1f4d4ff-e81c-30a8-b894-886cb922ef98", "name": "Bebidas De Cereales, Semillas Y Vegetales", "client": "Coca Cola", "createdAt": "2025-05-12 14:05:53", "updatedAt": "2025-05-12 14:05:53" },
      { "id": "8cc94ccd-fb8c-30f8-972a-a5b115295383", "name": "Bebidas De Jugo", "client": "Coca Cola", "createdAt": "2025-05-12 14:07:32", "updatedAt": "2025-05-12 14:07:32" },
      { "id": "41603dbb-416a-3ee0-b998-a21ee16bbf32", "name": "Bebidas Hidratantes", "client": "Coca Cola", "createdAt": "2025-05-12 14:08:59", "updatedAt": "2025-05-12 14:08:59" },
      { "id": "3cc19ac9-2891-3712-bb23-6ecef286af76", "name": "Beutel mZ", "client": "Perfetti Van Melle", "createdAt": "2025-10-01 12:48:23", "updatedAt": "2025-10-01 12:48:23" },
      { "id": "689f1c13-b5c9-3bda-8546-6d524ced88c6", "name": "Beutel oZ", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:17:49", "updatedAt": "2025-09-30 19:17:49" },
      { "id": "d7d0dafd-f50b-30da-b409-235af839ab85", "name": "Beverages", "client": "Client 42", "createdAt": "2025-11-13 15:02:00", "updatedAt": "2025-11-13 15:02:00" },
      { "id": "9ff95877-8436-374b-b170-3e7042760d23", "name": "Big Babol", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 18:23:08", "updatedAt": "2025-09-30 18:23:08" },
      { "id": "5be28f77-0db4-38ec-b3fb-0244de7b10d5", "name": "Black Orange", "client": "Client 25", "createdAt": "2025-09-17 12:40:31", "updatedAt": "2025-09-17 12:40:31" },
      { "id": "544f5f20-e18e-33b8-a1bc-04c510edb95e", "name": "Blenders", "client": "Spectrum Brands", "createdAt": "2026-04-02 13:34:26", "updatedAt": "2026-04-02 13:34:26" },
      { "id": "b41f3a98-eebd-360a-9069-3e7caf29d660", "name": "Body", "client": "Loreal", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "c3fc5aff-66c0-3b05-a2e8-eb7f505ac1cd", "name": "Body", "client": "Cosnova", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "82cbc5d7-eb17-3519-8830-59e86a7b7213", "name": "Bolleria", "client": "Client 11", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "2bc4fa77-26c5-3d6c-b704-6fcbf6b7843a", "name": "Bolleria", "client": "Client 87f4d0e6", "createdAt": "2024-09-30 15:30:11", "updatedAt": "2024-09-30 15:30:11" },
      { "id": "44332aec-4fbc-3619-af17-d75175de8ab8", "name": "Bollería Salada - Pan", "client": "Client 11", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "39738a41-d7d9-3136-b84f-eaf6d058ba03", "name": "Bologna", "client": "Client 46", "createdAt": "2025-01-27 09:36:50", "updatedAt": "2025-01-27 09:36:50" },
      { "id": "654f094b-4ab2-3393-bc31-af5ba5892377", "name": "Bonbons", "client": "Perfetti Van Melle", "createdAt": "2024-07-05 12:52:21", "updatedAt": "2024-07-05 12:52:21" },
      { "id": "4f1e78c5-e374-3a18-a10d-66caa02d08b8", "name": "Boneca", "client": "Mattel", "createdAt": "2024-11-25 14:53:48", "updatedAt": "2024-11-25 14:53:48" },
      { "id": "9d3f081a-1c2a-32f1-ab78-e20748124c95", "name": "Boneca de Coleção", "client": "Mattel", "createdAt": "2024-11-25 14:54:02", "updatedAt": "2024-11-25 14:54:02" },
      { "id": "a824cf7e-1d62-3c9f-a19e-b304faf62d37", "name": "Boneco de Coleção", "client": "Mattel", "createdAt": "2024-11-25 14:58:14", "updatedAt": "2024-11-25 14:58:14" },
      { "id": "9a53f9da-f340-3996-b707-921e05fe91be", "name": "BOS Snacking", "client": "Client 32", "createdAt": "2025-12-22 13:07:22", "updatedAt": "2025-12-22 13:07:22" },
      { "id": "def66ea8-154e-3431-8c08-47a2d34aeb00", "name": "Bottles", "client": "Perfetti Van Melle", "createdAt": "2024-05-21 13:40:02", "updatedAt": "2024-05-21 13:40:02" },
      { "id": "c47b4914-64b8-4c64-b71e-98d8f704d1de", "name": "Box", "client": "Perfetti Van Melle", "createdAt": "2026-06-16 15:19:00", "updatedAt": "2026-06-16 15:19:00" },
      { "id": "7388f4f0-8015-3747-9b62-aa9c8317637d", "name": "Brandy", "client": "Client 33", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "1779d46e-5c36-3ddc-a2fb-9460afc167c8", "name": "Breakfast Bars", "client": "Client 18", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "34071094-3485-32b9-a0ed-77297de67a84", "name": "Brinquedo", "client": "Mattel", "createdAt": "2024-11-25 14:58:01", "updatedAt": "2024-11-25 14:58:01" },
      { "id": "72beb232-791e-37e3-b99c-421e10bb6435", "name": "Brinquedo para Bebês", "client": "Mattel", "createdAt": "2024-11-25 14:56:19", "updatedAt": "2024-11-25 14:56:19" },
      { "id": "0cec4865-2a2f-39ba-b937-86433d19a5c0", "name": "BTGS", "client": "Coca Cola", "createdAt": "2024-03-31 20:38:47", "updatedAt": "2024-03-31 20:38:47" },
      { "id": "054fc446-b5f1-3e66-949a-e1dac5b0e379", "name": "Bubble-gum", "client": "Perfetti Van Melle", "createdAt": "2025-03-10 10:56:03", "updatedAt": "2025-03-10 10:56:03" },
      { "id": "e1faaf1a-2ebe-3d0f-b019-a4bd59083046", "name": "Bulk", "client": "Perfetti Van Melle", "createdAt": "2024-08-01 14:37:56", "updatedAt": "2024-08-01 14:37:56" },
      { "id": "14bf91dc-ca14-3d2d-a37d-ffba46b321e9", "name": "Böxli", "client": "Perfetti Van Melle", "createdAt": "2025-09-30 19:17:27", "updatedAt": "2025-09-30 19:17:27" },
      { "id": "d59d4d00-e3cc-3eb0-8928-69974296ad0f", "name": "Cadeirinha para Bebês", "client": "Mattel", "createdAt": "2024-11-25 14:56:54", "updatedAt": "2024-11-25 14:56:54" },
      { "id": "92b9c1c9-3b35-37c8-aee9-541debc49d43", "name": "Café molido", "client": "Client 26", "createdAt": "2024-09-18 13:14:48", "updatedAt": "2024-09-18 13:14:48" },
      { "id": "2abad1e4-2418-3b29-9ee3-001cba4ae6d6", "name": "Candies", "client": "Mattel", "createdAt": "2025-10-07 19:25:36", "updatedAt": "2025-10-07 19:25:36" },
      { "id": "86ac6055-7657-33df-b6b0-159cdb26e3c9", "name": "Candy", "client": "Perfetti Van Melle", "createdAt": "2024-05-14 08:37:21", "updatedAt": "2024-05-14 08:37:21" },
      { "id": "ebfa8c38-e321-32af-9bae-6b4667ee76eb", "name": "Canister Vacuums", "client": "Spectrum Brands", "createdAt": "2026-04-02 13:34:40", "updatedAt": "2026-04-02 13:34:40" },
      { "id": "6ff76124-58f7-306f-baff-586b4c2f00f6", "name": "Caramelle", "client": "Perfetti Van Melle", "createdAt": "2025-11-14 18:21:10", "updatedAt": "2025-11-14 18:21:10" },
      { "id": "8d93ca40-7631-3491-b16d-75f7e4165329", "name": "Caramelos", "client": "Client 87f4d0e6", "createdAt": "2024-09-30 15:30:30", "updatedAt": "2024-09-30 15:30:30" },
      { "id": "119e0d1c-f17a-38ac-9bc5-d23d82a0293a", "name": "Carbonatados", "client": "Coca Cola", "createdAt": "2025-09-26 15:05:43", "updatedAt": "2025-09-26 15:05:43" },
      { "id": "c9ebca43-885d-3cd2-8a5f-55e8f7480fbb", "name": "Carbonated Soft Drinks", "client": "Client 42", "createdAt": "2026-01-30 14:17:22", "updatedAt": "2026-01-30 18:21:10" },
      { "id": "5781bdb3-01f3-46b9-b895-6add25a8fb6d", "name": "Carbonated Water", "client": "Client 42", "createdAt": "2026-05-18 15:52:17", "updatedAt": "2026-05-18 15:52:49" },
      { "id": "25cd0ee3-5436-3908-84df-94f8706b032c", "name": "Caremelle", "client": "Perfetti Van Melle", "createdAt": "2024-03-31 20:38:46", "updatedAt": "2024-03-31 20:38:46" },
      { "id": "f85f2f57-9fac-315c-8dc1-e27b1ea82f01", "name": "Casa de Bonecas", "client": "Mattel", "createdAt": "2024-11-25 14:54:26", "updatedAt": "2024-11-25 14:54:26" },
      { "id": "24e5fda3-a21f-3ba5-890d-657fd66b4b42", "name": "Casa de Muñecas", "client": "Mattel", "createdAt": "2024-11-18 11:15:45", "updatedAt": "2024-11-18 11:15:45" },
      { "id": "8dc8e628-4425-4a5f-a1f6-50e3c10f989d", "name": "CAT FOOD", "client": "Client 19", "createdAt": "2026-05-08 14:15:27", "updatedAt": "2026-05-08 14:15:27" },
      { "id": "e40ba6b6-6cb8-3cb0-8116-1de538663c4a", "name": "CB", "client": "Perfetti Van Melle", "createdAt": "2025-10-23 16:58:18", "updatedAt": "2025-10-23 16:58:18" },
      { "id": "b2c57438-c8ac-31ff-b717-e635cf8a6d31", "name": "CCSA MS", "client": "Coca Cola", "createdAt": "2025-05-15 14:42:02", "updatedAt": "2025-05-15 14:42:02" },
      { "id": "b0b0c59c-4fd2-34d0-9a99-d5e5f608672b", "name": "CCSA SS", "client": "Coca Cola", "createdAt": "2025-05-15 14:42:27", "updatedAt": "2025-05-15 14:42:27" },
      { "id": "83958e5b-588b-33cf-add4-9cce75a3ce76", "name": "CCSL", "client": "Coca Cola", "createdAt": "2025-05-15 14:42:43", "updatedAt": "2025-05-15 14:42:43" },
      { "id": "703ee632-4bf7-3984-9b4c-da6372e7d5ec", "name": "CCSO MS", "client": "Coca Cola", "createdAt": "2025-05-15 14:42:59", "updatedAt": "2025-05-15 14:42:59" },
      { "id": "999c310d-566d-379b-a195-0a9cc2feb81b", "name": "CCSO SS", "client": "Coca Cola", "createdAt": "2025-05-15 14:43:13", "updatedAt": "2025-05-15 14:43:13" },
      { "id": "2f455e4a-c424-3267-ab89-bcff775a3c93", "name": "Cereal", "client": "JDE", "createdAt": "2025-03-24 11:28:46", "updatedAt": "2025-03-24 11:28:46" },
      { "id": "3b262d6b-9df1-3b24-be20-b6e3b5d20262", "name": "Cereal Bars", "client": "Client 42", "createdAt": "2025-02-26 21:43:30", "updatedAt": "2025-02-26 21:43:30" },
      { "id": "a1975e3a-cc93-3152-9fff-9b3d17dd9882", "name": "Cereals", "client": "Client 18", "createdAt": "2024-03-31 20:38:46", "updatedAt": "2024-03-31 20:38:46" },
      { "id": "d2dbefc7-dbaa-3932-ada5-1266318dfd2a", "name": "CEREJAS E FRUTAS SILVESTRES", "client": "Client 25", "createdAt": "2025-09-17 18:09:33", "updatedAt": "2025-09-17 18:09:33" },
      { "id": "3757a658-1674-4e0c-9ee6-2ff80bd67b3a", "name": "Cervejas", "client": "Coca Cola", "createdAt": "2026-06-23 13:24:00", "updatedAt": "2026-06-23 13:24:00" },
      { "id": "5973d6bc-58c4-3fc4-9d7a-e9e5429e8eb9", "name": "Cerveza", "client": "Client 16", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "d5e8b4b3-5190-3c14-8d53-0951e9684ff3", "name": "Champagne", "client": "Coca Cola", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" },
      { "id": "41eaa078-9dd2-364e-bb0f-85b3cf3855b1", "name": "Champagne", "client": "Client 33", "createdAt": "2025-07-22 14:14:51", "updatedAt": "2025-07-22 14:14:51" },
      { "id": "41d1b6a2-74d7-3a89-97f4-844f73769a99", "name": "Champagne Grand Vintage", "client": "Client 10", "createdAt": "2024-11-21 16:28:21", "updatedAt": "2024-11-21 16:29:59" },
      { "id": "e5d7d5db-c5c0-37c7-85a4-04b7d5450fcc", "name": "Champiñones", "client": "Client 26", "createdAt": "2024-09-18 13:14:48", "updatedAt": "2024-09-18 13:14:48" },
      { "id": "f79e5f6f-c10a-38b8-bb32-55552f0755ad", "name": "Champú", "client": "Client 30bb604f", "createdAt": "2024-06-17 15:09:19", "updatedAt": "2024-06-17 15:09:19" },
      { "id": "ef9e7012-7c06-3d1a-8c15-0f5ad7bc9368", "name": "Cheladas", "client": "Client 22", "createdAt": "2025-07-10 15:12:52", "updatedAt": "2025-07-10 15:12:52" },
      { "id": "d82a58d8-0e6c-37e8-b3ba-bf2e2dd968e9", "name": "Chicharron", "client": "Client 42", "createdAt": "2025-09-30 11:58:03", "updatedAt": "2025-09-30 11:58:03" },
      { "id": "77432dd8-6327-3c01-9335-4e45a2bca9b6", "name": "Chilled Coffee", "client": "Client 42", "createdAt": "2026-01-30 14:17:50", "updatedAt": "2026-01-30 18:18:46" },
      { "id": "aa8813de-c795-30c9-9d21-858a9e36f67e", "name": "Chips", "client": "Client 18", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "74d2583f-cdb3-30c2-8b5a-c3712f3bba89", "name": "Chips Cookies", "client": "Client 42", "createdAt": "2025-02-26 21:43:30", "updatedAt": "2025-02-26 21:43:30" },
      { "id": "978b54fe-4afc-3532-8608-f8b0a4c93fd2", "name": "Chocolate", "client": "Client 87f4d0e6", "createdAt": "2024-09-30 15:29:09", "updatedAt": "2024-09-30 15:29:09" },
      { "id": "136db551-d14d-3280-b1fe-401e0f3db444", "name": "Chocolate Premium", "client": "Mattel", "createdAt": "2024-03-31 20:38:45", "updatedAt": "2024-03-31 20:38:45" },
      { "id": "d437fca1-181c-3a6e-a56e-39276b9e7ee9", "name": "Cider", "client": "Coca Cola", "createdAt": "2024-03-31 20:38:44", "updatedAt": "2024-03-31 20:38:44" }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "client",
        "label": "Client",
        "type": "text",
        "required": true
      }
    ]
  },
  "store-skus": {
    "key": "store-skus",
    "title": "Store skus",
    "addLabel": "Add store sku",
    "search": "",
    "filters": [
      "Ids",
      "Store",
      "Discovery key",
      "Sku",
      "Hash",
      "Clients",
      "Active",
      "Created at",
      "Updated at"
    ],
    "total": 1542,
    "columns": [
      {
        "label": "Id",
        "key": "id"
      },
      {
        "label": "Store",
        "key": "store"
      },
      {
        "label": "Client",
        "key": "client"
      },
      {
        "label": "Discovery key",
        "key": "discoveryKey"
      },
      {
        "label": "Sku id",
        "key": "skuId"
      },
      {
        "label": "Matching type",
        "key": "matchingType"
      },
      {
        "label": "Hash",
        "key": "hash"
      },
      {
        "label": "Status",
        "key": "isActive"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "sku-store-001",
        "store": "Downtown Market",
        "client": "Coca Cola",
        "discoveryKey": "dk-2024-001",
        "skuId": "4012000505019",
        "matchingType": "exact",
        "hash": "a1b2c3d4e5f6",
        "isActive": true,
        "createdAt": "2024-01-15 09:30:00",
        "updatedAt": "2024-06-10 14:22:00"
      },
      {
        "id": "sku-store-002",
        "store": "Central Shopping",
        "client": "Pepsi",
        "discoveryKey": "dk-2024-002",
        "skuId": "5449000050017",
        "matchingType": "fuzzy",
        "hash": "b2c3d4e5f6a1",
        "isActive": true,
        "createdAt": "2024-02-20 11:45:00",
        "updatedAt": "2024-06-08 16:10:00"
      },
      {
        "id": "sku-store-003",
        "store": "Westside Depot",
        "client": "Sprite",
        "discoveryKey": "dk-2024-003",
        "skuId": "3614221020005",
        "matchingType": "partial",
        "hash": "c3d4e5f6a1b2",
        "isActive": false,
        "createdAt": "2024-03-10 08:15:00",
        "updatedAt": "2024-05-22 10:30:00"
      },
      {
        "id": "sku-store-004",
        "store": "Metro Hub",
        "client": "Fanta",
        "discoveryKey": "dk-2024-004",
        "skuId": "5000112640482",
        "matchingType": "exact",
        "hash": "d4e5f6a1b2c3",
        "isActive": true,
        "createdAt": "2024-04-05 13:20:00",
        "updatedAt": "2024-06-09 12:45:00"
      },
      {
        "id": "sku-store-005",
        "store": "North Point",
        "client": "Coca Cola",
        "discoveryKey": "dk-2024-005",
        "skuId": "4006381333298",
        "matchingType": "fuzzy",
        "hash": "e5f6a1b2c3d4",
        "isActive": true,
        "createdAt": "2024-05-12 10:00:00",
        "updatedAt": "2024-06-07 15:55:00"
      },
      {
        "id": "sku-store-006",
        "store": "Southgate Plaza",
        "client": "RedBull",
        "discoveryKey": "dk-2024-006",
        "skuId": "7613033149821",
        "matchingType": "exact",
        "hash": "f6a1b2c3d4e5",
        "isActive": true,
        "createdAt": "2024-06-01 09:30:00",
        "updatedAt": "2024-06-10 11:20:00"
      }
    ],
    "fields": [
      {
        "key": "store",
        "label": "Store",
        "type": "text",
        "required": true
      },
      {
        "key": "discoveryKey",
        "label": "Discovery key",
        "type": "text",
        "required": true
      },
      {
        "key": "sku",
        "label": "Sku id",
        "type": "text",
        "required": true
      },
      {
        "key": "matchingType",
        "label": "Matching type",
        "type": "select",
        "required": true,
        "options": [
          "Manual",
          "Assisted"
        ]
      }
    ]
  },
  "sku-rpcs": {
    "key": "sku-rpcs",
    "title": "Sku rpcs",
    "addLabel": "Add sku rpc",
    "search": "",
    "filters": [
      "Title",
      "Ids",
      "Sku",
      "Store",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Rpc",
        "key": "rpc"
      },
      {
        "label": "Store",
        "key": "store"
      },
      {
        "label": "Sku id",
        "key": "skuId"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "rpc-001-2024",
        "rpc": "RPC-2024-001",
        "store": "New York Downtown",
        "skuId": "SKU-789456123",
        "createdAt": "2024-01-15 09:30",
        "updatedAt": "2024-06-10 14:22"
      },
      {
        "id": "rpc-002-2024",
        "rpc": "RPC-2024-002",
        "store": "Los Angeles West",
        "skuId": "SKU-456789012",
        "createdAt": "2024-02-20 11:45",
        "updatedAt": "2024-05-28 16:18"
      },
      {
        "id": "rpc-003-2024",
        "rpc": "RPC-2024-003",
        "store": "Chicago Central",
        "skuId": "SKU-123789456",
        "createdAt": "2024-03-10 08:15",
        "updatedAt": "2024-06-05 10:37"
      },
      {
        "id": "rpc-004-2024",
        "rpc": "RPC-2024-004",
        "store": "Boston North",
        "skuId": "SKU-234567890",
        "createdAt": "2024-01-30 13:20",
        "updatedAt": "2024-06-09 09:55"
      },
      {
        "id": "rpc-005-2024",
        "rpc": "RPC-2024-005",
        "store": "Seattle Pacific",
        "skuId": "SKU-567890123",
        "createdAt": "2024-04-05 15:40",
        "updatedAt": "2024-06-11 11:12"
      },
      {
        "id": "rpc-006-2024",
        "rpc": "RPC-2024-006",
        "store": "Miami South",
        "skuId": "SKU-890123456",
        "createdAt": "2024-02-28 10:25",
        "updatedAt": "2024-06-08 13:48"
      }
    ],
    "fields": [
      {
        "key": "rpc",
        "label": "Rpc",
        "type": "text",
        "required": true
      },
      {
        "key": "store",
        "label": "Store",
        "type": "text",
        "required": true
      },
      {
        "key": "sku",
        "label": "Sku id",
        "type": "text",
        "required": true
      }
    ]
  },
  "assortments": {
    "key": "assortments",
    "title": "Assortments",
    "addLabel": "Add assortment",
    "search": "",
    "filters": [
      "Stores",
      "Automatic",
      "Ids",
      "Clients",
      "Active at",
      "Created at",
      "Updated at"
    ],
    "total": 1247,
    "columns": [
      {
        "label": "Id",
        "key": "id"
      },
      {
        "label": "Client",
        "key": "client"
      },
      {
        "label": "Store",
        "key": "store"
      },
      {
        "label": "Is automatic",
        "key": "isAutomatic"
      },
      {
        "label": "Active from",
        "key": "activeFrom"
      },
      {
        "label": "Active to",
        "key": "activeTo"
      },
      {
        "label": "Created at",
        "key": "creationDateTime"
      },
      {
        "label": "Updated at",
        "key": "lastUpdatedDateTime"
      }
    ],
    "rows": [
      {
        "id": "ast-2024-001",
        "client": "Coca-Cola Inc",
        "store": "New York Central",
        "isAutomatic": true,
        "activeFrom": "2024-01-15",
        "activeTo": "2025-12-31",
        "creationDateTime": "2024-01-10 09:30",
        "lastUpdatedDateTime": "2024-06-05 14:22"
      },
      {
        "id": "ast-2024-045",
        "client": "PepsiCo",
        "store": "Los Angeles West",
        "isAutomatic": false,
        "activeFrom": "2024-03-20",
        "activeTo": "2025-06-30",
        "creationDateTime": "2024-03-15 11:15",
        "lastUpdatedDateTime": "2024-06-08 10:45"
      },
      {
        "id": "ast-2024-089",
        "client": "Red Bull",
        "store": "Miami Beach",
        "isAutomatic": true,
        "activeFrom": "2024-02-01",
        "activeTo": "2025-01-31",
        "creationDateTime": "2024-01-28 08:00",
        "lastUpdatedDateTime": "2024-06-10 16:30"
      },
      {
        "id": "ast-2024-134",
        "client": "Nestlé Waters",
        "store": "Chicago Downtown",
        "isAutomatic": false,
        "activeFrom": "2024-04-10",
        "activeTo": "2024-12-15",
        "creationDateTime": "2024-04-05 13:45",
        "lastUpdatedDateTime": "2024-05-20 09:15"
      },
      {
        "id": "ast-2024-167",
        "client": "Monster Energy",
        "store": "Houston Heights",
        "isAutomatic": true,
        "activeFrom": "2024-05-01",
        "activeTo": "2026-04-30",
        "creationDateTime": "2024-04-25 10:20",
        "lastUpdatedDateTime": "2024-06-09 15:50"
      },
      {
        "id": "ast-2024-203",
        "client": "Vitamin Water",
        "store": "Seattle Pioneer",
        "isAutomatic": false,
        "activeFrom": "2024-06-01",
        "activeTo": "2025-05-31",
        "creationDateTime": "2024-05-28 14:00",
        "lastUpdatedDateTime": "2024-06-10 11:30"
      }
    ],
    "fields": [
      {
        "key": "client",
        "label": "Client",
        "type": "text",
        "required": true
      },
      {
        "key": "store",
        "label": "Store",
        "type": "text",
        "required": true
      },
      {
        "key": "activeFrom",
        "label": "Active from",
        "type": "date",
        "required": false
      },
      {
        "key": "activeTo",
        "label": "Active to",
        "type": "date",
        "required": false
      },
      {
        "key": "isAutomatic",
        "label": "Is automatic",
        "type": "checkbox",
        "required": false
      },
      {
        "key": "isMultiMatching",
        "label": "Is multi matching",
        "type": "checkbox",
        "required": false
      }
    ]
  },
  "sku-image-references": {
    "key": "sku-image-references",
    "title": "Sku images",
    "addLabel": "Upload sku images",
    "search": "Search sku images",
    "filters": [
      "Ids",
      "Client",
      "Client sku",
      "Active",
      "Created At",
      "Updated At"
    ],
    "total": 347,
    "columns": [
      {
        "label": "Image",
        "key": "image"
      },
      {
        "label": "Image type",
        "key": "imageType"
      },
      {
        "label": "Position",
        "key": "position"
      },
      {
        "label": "Client sku",
        "key": "clientSku"
      },
      {
        "label": "Locale",
        "key": "localeCode"
      },
      {
        "label": "Date",
        "key": "date"
      },
      {
        "label": "Created At",
        "key": "createdAt"
      },
      {
        "label": "Updated At",
        "key": "updatedAt"
      },
      {
        "label": "Active",
        "key": "isActive"
      }
    ],
    "rows": [
      {
        "id": "sir-001-front",
        "image": "[image thumbnail]",
        "imageType": "Front",
        "position": 1,
        "clientSku": "Coca Cola 12oz Glass Bottle",
        "localeCode": "en_US",
        "date": "2026-03-15",
        "createdAt": "2026-03-15T09:22:00Z",
        "updatedAt": "2026-06-01T14:30:00Z",
        "isActive": true
      },
      {
        "id": "sir-002-back",
        "image": "[image thumbnail]",
        "imageType": "Back",
        "position": 2,
        "clientSku": "Coca Cola 12oz Glass Bottle",
        "localeCode": "en_US",
        "date": "2026-03-16",
        "createdAt": "2026-03-16T10:15:00Z",
        "updatedAt": "2026-05-28T11:45:00Z",
        "isActive": true
      },
      {
        "id": "sir-003-side",
        "image": "[image thumbnail]",
        "imageType": "Side",
        "position": 3,
        "clientSku": "Pepsi Max 500ml Can",
        "localeCode": "pt_BR",
        "date": "2026-02-20",
        "createdAt": "2026-02-20T08:00:00Z",
        "updatedAt": "2026-04-10T16:20:00Z",
        "isActive": true
      },
      {
        "id": "sir-004-label",
        "image": "[image thumbnail]",
        "imageType": "Label",
        "position": 1,
        "clientSku": "Sprite 1L Bottle",
        "localeCode": "es_MX",
        "date": "2026-04-12",
        "createdAt": "2026-04-12T13:30:00Z",
        "updatedAt": "2026-06-05T09:15:00Z",
        "isActive": false
      },
      {
        "id": "sir-005-packaging",
        "image": "[image thumbnail]",
        "imageType": "Packaging",
        "position": 2,
        "clientSku": "Fanta Orange 2L Bottle",
        "localeCode": "en_GB",
        "date": "2026-05-01",
        "createdAt": "2026-05-01T11:45:00Z",
        "updatedAt": "2026-06-08T10:00:00Z",
        "isActive": true
      },
      {
        "id": "sir-006-front-alt",
        "image": "[image thumbnail]",
        "imageType": "Front",
        "position": 1,
        "clientSku": "Minute Maid Orange Juice 200ml",
        "localeCode": "fr_FR",
        "date": "2026-01-30",
        "createdAt": "2026-01-30T14:22:00Z",
        "updatedAt": "2026-05-20T15:30:00Z",
        "isActive": true
      }
    ],
    "fields": [
      {
        "key": "client",
        "label": "Client",
        "type": "text",
        "required": true
      },
      {
        "key": "codeKey",
        "label": "Code key",
        "type": "text",
        "required": true
      },
      {
        "key": "countryCodes",
        "label": "Countries",
        "type": "text",
        "required": true
      },
      {
        "key": "locale",
        "label": "Locale",
        "type": "text",
        "required": true
      },
      {
        "key": "imageUploadMode",
        "label": "Image upload mode",
        "type": "select",
        "required": true,
        "options": [
          "Complete",
          "Partial"
        ]
      },
      {
        "key": "skuImageReferencesPackage",
        "label": "Sku image references",
        "type": "text",
        "required": true
      }
    ]
  },
  "sku-retailer-image-references": {
    "key": "sku-retailer-image-references",
    "title": "Sku retailer image references",
    "addLabel": "Upload retailer sku image references",
    "search": "Search Sku retailer image references",
    "filters": [
      "Ids",
      "Client",
      "Client sku",
      "Active",
      "Created At",
      "Updated At"
    ],
    "total": 342,
    "columns": [
      {
        "label": "Image",
        "key": "imageUrl"
      },
      {
        "label": "Image type",
        "key": "imageType"
      },
      {
        "label": "Position",
        "key": "position"
      },
      {
        "label": "Client sku",
        "key": "clientSku"
      },
      {
        "label": "Retailer",
        "key": "retailer"
      },
      {
        "label": "Locale",
        "key": "locale"
      },
      {
        "label": "Date",
        "key": "date"
      },
      {
        "label": "Created At",
        "key": "createdAt"
      },
      {
        "label": "Updated At",
        "key": "updatedAt"
      },
      {
        "label": "Active",
        "key": "isActive"
      }
    ],
    "rows": [
      {
        "id": "ref-001",
        "imageUrl": "[image preview]",
        "imageType": "Product Front",
        "position": "1",
        "clientSku": "SKU-2024-001",
        "retailer": "Walmart",
        "locale": "en-US",
        "date": "2024-05-15",
        "createdAt": "2024-05-10 09:30:00",
        "updatedAt": "2024-06-02 14:20:00",
        "isActive": true
      },
      {
        "id": "ref-002",
        "imageUrl": "[image preview]",
        "imageType": "Product Back",
        "position": "2",
        "clientSku": "SKU-2024-002",
        "retailer": "Target",
        "locale": "en-US",
        "date": "2024-05-18",
        "createdAt": "2024-05-12 11:15:00",
        "updatedAt": "2024-05-28 10:45:00",
        "isActive": true
      },
      {
        "id": "ref-003",
        "imageUrl": "[image preview]",
        "imageType": "Packaging",
        "position": "3",
        "clientSku": "SKU-2024-003",
        "retailer": "Amazon",
        "locale": "en-GB",
        "date": "2024-05-20",
        "createdAt": "2024-05-14 08:00:00",
        "updatedAt": "2024-06-08 16:30:00",
        "isActive": false
      },
      {
        "id": "ref-004",
        "imageUrl": "[image preview]",
        "imageType": "Product Front",
        "position": "1",
        "clientSku": "SKU-2024-004",
        "retailer": "Costco",
        "locale": "en-US",
        "date": "2024-06-01",
        "createdAt": "2024-05-20 13:45:00",
        "updatedAt": "2024-06-05 09:10:00",
        "isActive": true
      },
      {
        "id": "ref-005",
        "imageUrl": "[image preview]",
        "imageType": "Label Detail",
        "position": "4",
        "clientSku": "SKU-2024-005",
        "retailer": "Best Buy",
        "locale": "fr-CA",
        "date": "2024-06-03",
        "createdAt": "2024-05-25 10:20:00",
        "updatedAt": "2024-06-06 11:00:00",
        "isActive": true
      },
      {
        "id": "ref-006",
        "imageUrl": "[image preview]",
        "imageType": "Product Side",
        "position": "2",
        "clientSku": "SKU-2024-006",
        "retailer": "Home Depot",
        "locale": "es-MX",
        "date": "2024-06-05",
        "createdAt": "2024-05-28 15:30:00",
        "updatedAt": "2024-06-09 12:45:00",
        "isActive": false
      }
    ],
    "fields": [
      {
        "key": "client",
        "label": "Client",
        "type": "text",
        "required": true
      },
      {
        "key": "retailers",
        "label": "Retailers",
        "type": "text",
        "required": true
      },
      {
        "key": "codeKey",
        "label": "Code key",
        "type": "text",
        "required": true
      },
      {
        "key": "countryCodes",
        "label": "Countries",
        "type": "text",
        "required": true
      },
      {
        "key": "locale",
        "label": "Locale",
        "type": "text",
        "required": true
      },
      {
        "key": "imageUploadMode",
        "label": "Image upload mode",
        "type": "select",
        "required": true,
        "options": [
          "Complete",
          "Partial"
        ]
      },
      {
        "key": "skuRetailerImageReferencesPackage",
        "label": "SKU retailer image references",
        "type": "text",
        "required": true
      }
    ]
  },
  "sku-store-image-references": {
    "key": "sku-store-image-references",
    "title": "Sku store image references",
    "addLabel": "Upload store sku image references",
    "search": "",
    "filters": [
      "Ids",
      "Client",
      "Client sku",
      "Store",
      "Active",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Image",
        "key": "imageUrl"
      },
      {
        "label": "Image type",
        "key": "imageType"
      },
      {
        "label": "Position",
        "key": "position"
      },
      {
        "label": "Client sku",
        "key": "clientSku"
      },
      {
        "label": "Store",
        "key": "store"
      },
      {
        "label": "Locale",
        "key": "locale"
      },
      {
        "label": "Date",
        "key": "date"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      },
      {
        "label": "Is active",
        "key": "isActive"
      }
    ],
    "rows": [
      {
        "id": "img_ref_001",
        "imageUrl": "https://imgproxy.example.com/abc123",
        "imageType": "PRODUCT_IMAGE",
        "position": 1,
        "clientSku": "SKU-12345-BLUE",
        "store": "NYC Flagship",
        "locale": "en-US",
        "date": "2026-06-08",
        "createdAt": "2026-06-01 10:30:45",
        "updatedAt": "2026-06-08 14:22:15",
        "isActive": true
      },
      {
        "id": "img_ref_002",
        "imageUrl": "https://imgproxy.example.com/def456",
        "imageType": "THUMBNAIL",
        "position": 2,
        "clientSku": "SKU-67890-RED",
        "store": "LA Downtown",
        "locale": "en-US",
        "date": "2026-06-07",
        "createdAt": "2026-05-28 09:15:30",
        "updatedAt": "2026-06-07 11:45:22",
        "isActive": true
      },
      {
        "id": "img_ref_003",
        "imageUrl": "https://imgproxy.example.com/ghi789",
        "imageType": "PRODUCT_IMAGE",
        "position": 1,
        "clientSku": "SKU-54321-GREEN",
        "store": "Chicago Central",
        "locale": "fr-FR",
        "date": "2026-06-06",
        "createdAt": "2026-06-02 13:20:10",
        "updatedAt": "2026-06-06 16:33:44",
        "isActive": false
      },
      {
        "id": "img_ref_004",
        "imageUrl": "https://imgproxy.example.com/jkl012",
        "imageType": "SWATCH",
        "position": 3,
        "clientSku": "SKU-11111-BLACK",
        "store": "Boston Back Bay",
        "locale": "en-US",
        "date": "2026-06-05",
        "createdAt": "2026-05-30 11:05:20",
        "updatedAt": "2026-06-05 09:12:33",
        "isActive": true
      },
      {
        "id": "img_ref_005",
        "imageUrl": "https://imgproxy.example.com/mno345",
        "imageType": "PRODUCT_IMAGE",
        "position": 2,
        "clientSku": "SKU-99999-SILVER",
        "store": "Miami Beach",
        "locale": "es-ES",
        "date": "2026-06-04",
        "createdAt": "2026-05-25 15:40:05",
        "updatedAt": "2026-06-04 10:28:56",
        "isActive": true
      },
      {
        "id": "img_ref_006",
        "imageUrl": "https://imgproxy.example.com/pqr678",
        "imageType": "THUMBNAIL",
        "position": 1,
        "clientSku": "SKU-33333-WHITE",
        "store": "Seattle Bellevue",
        "locale": "en-CA",
        "date": "2026-06-03",
        "createdAt": "2026-06-01 08:50:15",
        "updatedAt": "2026-06-03 13:17:42",
        "isActive": false
      }
    ],
    "fields": [
      {
        "key": "client",
        "label": "Client",
        "type": "text",
        "required": true
      },
      {
        "key": "stores",
        "label": "Stores",
        "type": "text",
        "required": true
      },
      {
        "key": "codeKey",
        "label": "Code Key",
        "type": "text",
        "required": true
      },
      {
        "key": "countryCodes",
        "label": "Countries",
        "type": "text",
        "required": true
      },
      {
        "key": "locale",
        "label": "Locale",
        "type": "text",
        "required": true
      },
      {
        "key": "imageUploadMode",
        "label": "Image Upload Mode",
        "type": "select",
        "required": true,
        "options": [
          "Complete",
          "Partial"
        ]
      },
      {
        "key": "skuStoreImageReferencesPackage",
        "label": "SKU Store Image References",
        "type": "text",
        "required": true
      }
    ]
  },
  "sku-text-references": {
    "key": "sku-text-references",
    "title": "Sku text references",
    "addLabel": "Add text references",
    "search": "Search Sku text references",
    "filters": [
      "Client",
      "Client sku",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Title",
        "key": "title"
      },
      {
        "label": "Client sku",
        "key": "clientSku"
      },
      {
        "label": "Description",
        "key": "description"
      },
      {
        "label": "Bullet points",
        "key": "bulletPoints"
      },
      {
        "label": "Title keywords",
        "key": "titleKeywords"
      },
      {
        "label": "Description keywords",
        "key": "descriptionKeywords"
      },
      {
        "label": "Ingredients",
        "key": "ingredients"
      },
      {
        "label": "Nutrients",
        "key": "nutrients"
      },
      {
        "label": "Locale",
        "key": "localeCode"
      },
      {
        "label": "Date",
        "key": "date"
      }
    ],
    "rows": [
      {
        "id": "ref-001",
        "title": "Premium Coca-Cola Zero Sugar",
        "clientSku": "SKU-CC-2024-001",
        "description": "Zero calories, same great taste",
        "bulletPoints": "Zero sugar, Zero calories, Contains caramel coloring",
        "titleKeywords": "coca cola, zero sugar, diet cola",
        "descriptionKeywords": "sugar free, refreshing, carbonated",
        "ingredients": "Water, Carbon dioxide, Phosphoric acid, Caramel coloring",
        "nutrients": "Sodium 40mg, Potassium 0mg, Caffeine 34mg",
        "localeCode": "en_US",
        "date": "2024-06-10"
      },
      {
        "id": "ref-002",
        "title": "Sprite Lemon-Lime Crisp",
        "clientSku": "SKU-SP-2024-005",
        "description": "Crisp lemon lime refreshment",
        "bulletPoints": "100% natural flavors, No artificial sweeteners, Citrus blend",
        "titleKeywords": "sprite, lemon lime, citrus",
        "descriptionKeywords": "citrus flavor, refreshing drink, clear",
        "ingredients": "Carbonated water, High fructose corn syrup, Natural flavors",
        "nutrients": "Calories 140, Carbs 39g, Sugar 39g",
        "localeCode": "en_US",
        "date": "2024-06-09"
      },
      {
        "id": "ref-003",
        "title": "Fanta Orange Tropical",
        "clientSku": "SKU-FT-2024-003",
        "description": "Vibrant orange tropical flavor explosion",
        "bulletPoints": "Bright color, Fruity taste, Family favorite",
        "titleKeywords": "fanta, orange, tropical",
        "descriptionKeywords": "fruity, colorful, tropical punch",
        "ingredients": "Water, Sugar, Citric acid, Orange juice concentrate",
        "nutrients": "Calories 160, Carbs 43g, Sugar 43g",
        "localeCode": "pt_BR",
        "date": "2024-06-08"
      },
      {
        "id": "ref-004",
        "title": "Minute Maid Orange Juice",
        "clientSku": "SKU-MM-2024-002",
        "description": "Pure squeezed orange goodness",
        "bulletPoints": "100% orange juice, No added sugar, Cold pressed",
        "titleKeywords": "minute maid, orange juice, fresh",
        "descriptionKeywords": "juice, citrus, natural, vitamin C",
        "ingredients": "Orange juice, Ascorbic acid, Water",
        "nutrients": "Calories 110, Carbs 26g, Vitamin C 120%",
        "localeCode": "en_US",
        "date": "2024-06-07"
      },
      {
        "id": "ref-005",
        "title": "Dasani Purified Water",
        "clientSku": "SKU-DA-2024-001",
        "description": "Clean, refreshing purified water",
        "bulletPoints": "Purified water, Added minerals, Electrolyte enhanced",
        "titleKeywords": "dasani, water, purified",
        "descriptionKeywords": "hydration, pure water, mineral water",
        "ingredients": "Purified water, Minerals, Sodium chloride",
        "nutrients": "Sodium 55mg, Magnesium 1mg, Potassium 20mg",
        "localeCode": "en_US",
        "date": "2024-06-06"
      },
      {
        "id": "ref-006",
        "title": "Pibb Xtra Cherry Vanilla",
        "clientSku": "SKU-PX-2024-004",
        "description": "Bold cherry and smooth vanilla fusion",
        "bulletPoints": "Unique blend, Cherry flavor, Vanilla notes",
        "titleKeywords": "pibb xtra, cherry, vanilla",
        "descriptionKeywords": "cola alternative, bold taste, rich flavor",
        "ingredients": "Carbonated water, Caramel coloring, Cherry concentrate",
        "nutrients": "Calories 150, Carbs 41g, Caffeine 40mg",
        "localeCode": "es_MX",
        "date": "2024-06-05"
      }
    ],
    "fields": [
      {
        "key": "clientSku",
        "label": "Client sku",
        "type": "text",
        "required": true
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date",
        "required": true
      },
      {
        "key": "localeCode",
        "label": "Locale",
        "type": "text",
        "required": true
      },
      {
        "key": "title",
        "label": "Title",
        "type": "text",
        "required": true
      },
      {
        "key": "description",
        "label": "Description",
        "type": "textarea",
        "required": false
      },
      {
        "key": "bulletPoints",
        "label": "Bullet points",
        "type": "text",
        "required": false
      },
      {
        "key": "titleKeywords",
        "label": "Title keywords",
        "type": "text",
        "required": false
      },
      {
        "key": "descriptionKeywords",
        "label": "Description keywords",
        "type": "text",
        "required": false
      },
      {
        "key": "ingredients",
        "label": "Ingredients",
        "type": "text",
        "required": false
      },
      {
        "key": "nutrients",
        "label": "Nutrients",
        "type": "text",
        "required": false
      }
    ]
  },
  "sku-retailer-text-references": {
    "key": "sku-retailer-text-references",
    "title": "Sku retailer text references",
    "addLabel": "Add sku retailer text references",
    "search": "",
    "filters": [
      "Client",
      "Client sku",
      "Retailer",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Title",
        "key": "title"
      },
      {
        "label": "Client sku",
        "key": "clientSku"
      },
      {
        "label": "Retailer",
        "key": "retailer"
      },
      {
        "label": "Description",
        "key": "description"
      },
      {
        "label": "Bullet points",
        "key": "bulletPoints"
      },
      {
        "label": "Title keywords",
        "key": "titleKeywords"
      },
      {
        "label": "Description keywords",
        "key": "descriptionKeywords"
      },
      {
        "label": "Ingredients",
        "key": "ingredients"
      },
      {
        "label": "Nutrients",
        "key": "nutrients"
      },
      {
        "label": "Locale",
        "key": "localeCode"
      },
      {
        "label": "Date",
        "key": "date"
      },
      {
        "label": "Created at",
        "key": "creationDateTime"
      },
      {
        "label": "Updated at",
        "key": "lastUpdatedDateTime"
      }
    ],
    "rows": [
      {
        "id": "str_ret_001",
        "title": "Premium Orange Juice",
        "clientSku": "COCA-SKU-2024-001",
        "retailer": "Walmart USA",
        "description": "Fresh squeezed orange juice from Florida",
        "bulletPoints": "No added sugar, Natural flavor, Rich in Vitamin C",
        "titleKeywords": "organic, premium, natural",
        "descriptionKeywords": "fresh, squeezed, florida, juice",
        "ingredients": "Orange juice concentrate, Water, Natural flavor",
        "nutrients": "Vitamin C 120%, Folate 15%, Potassium 8%",
        "localeCode": "en-US",
        "date": "2024-06-10",
        "creationDateTime": "2024-06-10 14:32:45",
        "lastUpdatedDateTime": "2024-06-10 14:32:45"
      },
      {
        "id": "str_ret_002",
        "title": "Diet Cola Zero Sugar",
        "clientSku": "COCA-SKU-2024-002",
        "retailer": "Target Inc",
        "description": "Refreshing cola with zero calories and sugar",
        "bulletPoints": "Zero calories, Caffeine-free option, Crisp taste",
        "titleKeywords": "diet, zero, sugar-free",
        "descriptionKeywords": "zero calories, refreshing, cola",
        "ingredients": "Carbonated water, Caramel color, Phosphoric acid",
        "nutrients": "Sodium 45mg, No calories",
        "localeCode": "en-US",
        "date": "2024-06-08",
        "creationDateTime": "2024-06-08 09:15:22",
        "lastUpdatedDateTime": "2024-06-09 10:20:15"
      },
      {
        "id": "str_ret_003",
        "title": "Sprite Lemon-Lime Blast",
        "clientSku": "COCA-SKU-2024-005",
        "retailer": "Kroger",
        "description": "Vibrant lemon-lime flavored carbonated beverage",
        "bulletPoints": "Refreshing taste, No artificial colors, Great for parties",
        "titleKeywords": "lemon, lime, citrus",
        "descriptionKeywords": "vibrant, carbonated, citrus",
        "ingredients": "Carbonated water, High fructose corn syrup, Citric acid",
        "nutrients": "Sugar 65g, Sodium 65mg, Caffeine 0mg",
        "localeCode": "en-US",
        "date": "2024-06-05",
        "creationDateTime": "2024-06-05 11:45:30",
        "lastUpdatedDateTime": "2024-06-07 08:22:10"
      },
      {
        "id": "str_ret_004",
        "title": "Minute Maid Tropical Punch",
        "clientSku": "COCA-SKU-2024-010",
        "retailer": "Whole Foods",
        "description": "Tropical blend of mango, pineapple, and passion fruit juices",
        "bulletPoints": "Made with real fruit juice, No high fructose corn syrup, Excellent source of Vitamin C",
        "titleKeywords": "tropical, mango, pineapple",
        "descriptionKeywords": "tropical fruit, blend, natural",
        "ingredients": "Water, Pineapple juice concentrate, Mango puree",
        "nutrients": "Vitamin C 100%, Sugar 28g, Natural flavors",
        "localeCode": "en-US",
        "date": "2024-06-03",
        "creationDateTime": "2024-06-03 16:58:40",
        "lastUpdatedDateTime": "2024-06-04 13:05:28"
      },
      {
        "id": "str_ret_005",
        "title": "Fanta Grape Sensation",
        "clientSku": "COCA-SKU-2024-015",
        "retailer": "Safeway",
        "description": "Bold purple grape flavored soda with playful appeal",
        "bulletPoints": "Fun purple color, Great for kids, Bright grape flavor",
        "titleKeywords": "grape, purple, fun",
        "descriptionKeywords": "bold flavor, playful, grape soda",
        "ingredients": "Carbonated water, Sugar, Grape juice concentrate",
        "nutrients": "Sugar 70g, Sodium 50mg, Total carbs 65g",
        "localeCode": "en-US",
        "date": "2024-06-01",
        "creationDateTime": "2024-06-01 10:12:05",
        "lastUpdatedDateTime": "2024-06-02 14:45:32"
      },
      {
        "id": "str_ret_006",
        "title": "Dasani Purified Water",
        "clientSku": "COCA-SKU-2024-020",
        "retailer": "CVS Pharmacy",
        "description": "Crisp, purified drinking water with minerals added for taste",
        "bulletPoints": "Purified water, Minerals for better taste, Eco-friendly bottle",
        "titleKeywords": "water, pure, hydration",
        "descriptionKeywords": "purified, minerals, drinking water",
        "ingredients": "Purified water, Calcium sulfate, Magnesium sulfate",
        "nutrients": "Minerals added for taste, Zero calories",
        "localeCode": "en-US",
        "date": "2024-05-28",
        "creationDateTime": "2024-05-28 13:30:18",
        "lastUpdatedDateTime": "2024-05-30 09:15:42"
      }
    ],
    "fields": [
      {
        "key": "clientSku",
        "label": "Client SKU",
        "type": "text",
        "required": true
      },
      {
        "key": "retailer",
        "label": "Retailer",
        "type": "text",
        "required": true
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date",
        "required": true
      },
      {
        "key": "localeCode",
        "label": "Locale",
        "type": "text",
        "required": true
      },
      {
        "key": "title",
        "label": "Title",
        "type": "text",
        "required": true
      },
      {
        "key": "description",
        "label": "Description",
        "type": "textarea",
        "required": false
      },
      {
        "key": "bulletPoints",
        "label": "Bullet points",
        "type": "text",
        "required": false
      },
      {
        "key": "titleKeywords",
        "label": "Title keywords",
        "type": "text",
        "required": false
      },
      {
        "key": "descriptionKeywords",
        "label": "Description keywords",
        "type": "text",
        "required": false
      },
      {
        "key": "ingredients",
        "label": "Ingredients",
        "type": "text",
        "required": false
      },
      {
        "key": "nutrients",
        "label": "Nutrients",
        "type": "text",
        "required": false
      }
    ]
  },
  "sku-store-text-references": {
    "key": "sku-store-text-references",
    "title": "Sku store text references",
    "addLabel": "Add sku store text references",
    "search": "",
    "filters": [
      "Client",
      "Client sku",
      "Store",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Title",
        "key": "title"
      },
      {
        "label": "Client sku",
        "key": "clientSku"
      },
      {
        "label": "Store",
        "key": "store"
      },
      {
        "label": "Description",
        "key": "description"
      },
      {
        "label": "Bullet points",
        "key": "bulletPoints"
      },
      {
        "label": "Title keywords",
        "key": "titleKeywords"
      },
      {
        "label": "Description keywords",
        "key": "descriptionKeywords"
      },
      {
        "label": "Ingredients",
        "key": "ingredients"
      },
      {
        "label": "Nutrients",
        "key": "nutrients"
      },
      {
        "label": "Locale",
        "key": "localeCode"
      },
      {
        "label": "Date",
        "key": "date"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "ref-001",
        "title": "Premium Colombian Coffee",
        "clientSku": "SKU-COFFEE-PREMIUM",
        "store": "Carrefour Brazil",
        "description": "Single-origin premium coffee blend from Colombia with smooth flavor profile",
        "bulletPoints": "100% arabica, Fair trade certified, Freshly roasted",
        "titleKeywords": "Coffee, Premium, Colombian, Blend",
        "descriptionKeywords": "single-origin, smooth, specialty",
        "ingredients": "Coffee beans",
        "nutrients": "Caffeine: 95mg per cup",
        "localeCode": "pt-BR",
        "date": "2026-06-10",
        "createdAt": "2026-03-15",
        "updatedAt": "2026-06-08"
      },
      {
        "id": "ref-002",
        "title": "Organic Almond Milk",
        "clientSku": "SKU-ALMONDMILK-ORG",
        "store": "Tesco UK",
        "description": "Plant-based milk alternative made from premium organic almonds",
        "bulletPoints": "No artificial additives, Lactose-free, Rich in calcium",
        "titleKeywords": "Almond, Organic, Vegan, Milk",
        "descriptionKeywords": "plant-based, dairy-free, calcium enriched",
        "ingredients": "Filtered water, Organic almonds, Calcium carbonate",
        "nutrients": "Calcium: 450mg, Protein: 1g per serving",
        "localeCode": "en-GB",
        "date": "2026-06-09",
        "createdAt": "2026-04-22",
        "updatedAt": "2026-06-05"
      },
      {
        "id": "ref-003",
        "title": "Dark Chocolate 85%",
        "clientSku": "SKU-CHOCO-DARK-85",
        "store": "Sainsbury's UK",
        "description": "Premium dark chocolate with high cocoa content and minimal sugar",
        "bulletPoints": "No added preservatives, Ethically sourced cocoa, Vegan friendly",
        "titleKeywords": "Dark chocolate, Premium, Cocoa",
        "descriptionKeywords": "high cocoa, low sugar, premium",
        "ingredients": "Cocoa solids, Cocoa butter, Sugar, Soy lecithin",
        "nutrients": "Cocoa: 85%, Antioxidants high",
        "localeCode": "en-GB",
        "date": "2026-06-07",
        "createdAt": "2026-02-10",
        "updatedAt": "2026-06-04"
      },
      {
        "id": "ref-004",
        "title": "Whole Grain Pasta",
        "clientSku": "SKU-PASTA-WG-500",
        "store": "Continente Portugal",
        "description": "Whole grain pasta enriched with vitamins and minerals for better nutrition",
        "bulletPoints": "High in fiber, Low glycemic index, Non-GMO",
        "titleKeywords": "Pasta, Whole grain, Nutritious",
        "descriptionKeywords": "whole grain, high fiber, vitamins",
        "ingredients": "Whole wheat flour, Water, Durum wheat semolina",
        "nutrients": "Fiber: 6g, Protein: 12g per serving",
        "localeCode": "pt-PT",
        "date": "2026-06-08",
        "createdAt": "2026-01-30",
        "updatedAt": "2026-06-06"
      },
      {
        "id": "ref-005",
        "title": "Greek Yogurt Plain",
        "clientSku": "SKU-YOGURT-GRK-500G",
        "store": "Carrefour Spain",
        "description": "Creamy Greek yogurt made from pasteurized milk with live cultures",
        "bulletPoints": "Probiotics included, No artificial flavors, Gluten-free",
        "titleKeywords": "Greek yogurt, Probiotic, Creamy",
        "descriptionKeywords": "live cultures, pasteurized, creamy",
        "ingredients": "Milk, Live yogurt cultures, Salt",
        "nutrients": "Protein: 20g, Calcium: 15% DV per 100g",
        "localeCode": "es-ES",
        "date": "2026-06-06",
        "createdAt": "2026-05-12",
        "updatedAt": "2026-06-02"
      },
      {
        "id": "ref-006",
        "title": "Extra Virgin Olive Oil",
        "clientSku": "SKU-OLIVE-OIL-VIRGIN",
        "store": "El Corte Inglés Spain",
        "description": "Cold-pressed extra virgin olive oil from Spanish olive groves",
        "bulletPoints": "First cold-pressed, Protected denomination of origin, Rich polyphenols",
        "titleKeywords": "Olive oil, Extra virgin, Spanish, Premium",
        "descriptionKeywords": "cold-pressed, protected origin, polyphenols",
        "ingredients": "100% Olives",
        "nutrients": "Polyphenols: high content, Monounsaturated fat: 73%",
        "localeCode": "es-ES",
        "date": "2026-06-05",
        "createdAt": "2026-03-08",
        "updatedAt": "2026-06-01"
      }
    ],
    "fields": [
      {
        "key": "clientSku",
        "label": "Client SKU",
        "type": "text",
        "required": true
      },
      {
        "key": "store",
        "label": "Store",
        "type": "text",
        "required": true
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date",
        "required": true
      },
      {
        "key": "localeCode",
        "label": "Locale",
        "type": "text",
        "required": true
      },
      {
        "key": "title",
        "label": "Title",
        "type": "text",
        "required": true
      },
      {
        "key": "description",
        "label": "Description",
        "type": "textarea",
        "required": false
      },
      {
        "key": "bulletPoints",
        "label": "Bullet Points",
        "type": "text",
        "required": false
      },
      {
        "key": "titleKeywords",
        "label": "Title Keywords",
        "type": "text",
        "required": false
      },
      {
        "key": "descriptionKeywords",
        "label": "Description Keywords",
        "type": "text",
        "required": false
      },
      {
        "key": "ingredients",
        "label": "Ingredients",
        "type": "text",
        "required": false
      },
      {
        "key": "nutrients",
        "label": "Nutrients",
        "type": "text",
        "required": false
      }
    ]
  },
  "settings-cubes": {
    "key": "settings-cubes",
    "title": "Cubes",
    "addLabel": "New cube",
    "search": "",
    "filters": [
      "Name",
      "Description",
      "Created at",
      "Updated at"
    ],
    "total": 148,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Description",
        "key": "description"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "cube-001",
        "name": "Sales Analytics Cube",
        "description": "Multi-dimensional sales data for regional analysis",
        "createdAt": "2025-11-15 10:24:33",
        "updatedAt": "2026-05-22 14:18:45"
      },
      {
        "id": "cube-002",
        "name": "Customer Metrics Cube",
        "description": "Customer segmentation and behavior tracking",
        "createdAt": "2025-09-08 09:15:12",
        "updatedAt": "2026-06-01 11:42:20"
      },
      {
        "id": "cube-003",
        "name": "Inventory Levels",
        "description": "",
        "createdAt": "2026-01-20 16:45:22",
        "updatedAt": "2026-06-10 08:30:15"
      },
      {
        "id": "cube-004",
        "name": "Financial Performance",
        "description": "Revenue, expenses, and profitability metrics by division",
        "createdAt": "2025-12-03 13:22:48",
        "updatedAt": "2026-03-14 09:52:33"
      },
      {
        "id": "cube-005",
        "name": "Marketing Spend Analysis",
        "description": "Campaign ROI and channel effectiveness tracking",
        "createdAt": "2025-10-11 11:05:19",
        "updatedAt": "2026-04-28 15:38:02"
      },
      {
        "id": "cube-006",
        "name": "Product Quality Metrics",
        "description": "Defect rates, returns, and quality scores",
        "createdAt": "2026-02-27 14:33:55",
        "updatedAt": "2026-06-09 13:14:48"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "description",
        "label": "Description",
        "type": "textarea",
        "required": true
      }
    ]
  },
  "settings-scopes": {
    "key": "settings-scopes",
    "title": "Scopes",
    "addLabel": "New scope",
    "search": "",
    "filters": [
      "Name",
      "Created at",
      "Updated at"
    ],
    "total": 24,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "scope-001",
        "name": "Global Market Analysis",
        "createdAt": "2026-05-15 09:30:45",
        "updatedAt": "2026-06-08 14:22:18"
      },
      {
        "id": "scope-002",
        "name": "EMEA Region Focus",
        "createdAt": "2026-05-22 11:15:20",
        "updatedAt": "2026-06-10 16:45:33"
      },
      {
        "id": "scope-003",
        "name": "Product Performance Metrics",
        "createdAt": "2026-04-03 08:00:12",
        "updatedAt": "2026-05-28 10:33:55"
      },
      {
        "id": "scope-004",
        "name": "Competitor Intelligence",
        "createdAt": "2026-06-01 13:45:30",
        "updatedAt": "2026-06-09 09:12:47"
      },
      {
        "id": "scope-005",
        "name": "Customer Sentiment Tracking",
        "createdAt": "2026-03-18 15:20:05",
        "updatedAt": "2026-06-06 11:58:22"
      },
      {
        "id": "scope-006",
        "name": "Campaign Performance Dashboard",
        "createdAt": "2026-05-30 10:05:40",
        "updatedAt": "2026-06-10 13:19:56"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      }
    ]
  },
  "bulk": {
    "key": "bulk",
    "title": "Bulk",
    "addLabel": "Add bulk process",
    "search": "",
    "filters": [
      "Ids",
      "Type",
      "Status",
      "Created at",
      "Updated at"
    ],
    "total": 47,
    "columns": [
      {
        "label": "Id",
        "key": "id"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Status",
        "key": "status"
      },
      {
        "label": "Input file",
        "key": "inputFile"
      },
      {
        "label": "Type",
        "key": "type"
      },
      {
        "label": "Total rows",
        "key": "totalRows"
      },
      {
        "label": "Processed rows",
        "key": "processedRows"
      },
      {
        "label": "Row processing info",
        "key": "rowProcessingInfo"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      }
    ],
    "rows": [
      {
        "id": "PROC-20240611-001",
        "createdAt": "2024-06-11 10:32:45",
        "status": "COMPLETED",
        "inputFile": "inventory_update_q2_2024.csv",
        "type": "INVENTORY_SYNC",
        "totalRows": 5000,
        "processedRows": 5000,
        "rowProcessingInfo": "5000 success, 0 errors, 0 warnings",
        "updatedAt": "2024-06-11 10:45:22"
      },
      {
        "id": "PROC-20240611-002",
        "createdAt": "2024-06-11 09:15:30",
        "status": "IN_PROGRESS",
        "inputFile": "pricing_batch_daily.xlsx",
        "type": "PRICE_UPDATE",
        "totalRows": 2847,
        "processedRows": 1923,
        "rowProcessingInfo": "1800 success, 45 errors, 78 warnings",
        "updatedAt": "2024-06-11 10:50:15"
      },
      {
        "id": "PROC-20240610-098",
        "createdAt": "2024-06-10 16:42:10",
        "status": "COMPLETED",
        "inputFile": "promotional_items_june.csv",
        "type": "PROMOTION_LOAD",
        "totalRows": 1200,
        "processedRows": 1200,
        "rowProcessingInfo": "1180 success, 20 errors, 0 warnings",
        "updatedAt": "2024-06-10 17:05:33"
      },
      {
        "id": "PROC-20240609-045",
        "createdAt": "2024-06-09 14:28:55",
        "status": "FAILED",
        "inputFile": "store_locations_bulk.json",
        "type": "STORE_SETUP",
        "totalRows": 456,
        "processedRows": 234,
        "rowProcessingInfo": "189 success, 45 errors, 0 warnings",
        "updatedAt": "2024-06-09 14:35:48"
      },
      {
        "id": "PROC-20240608-112",
        "createdAt": "2024-06-08 11:20:30",
        "status": "COMPLETED",
        "inputFile": "sku_master_data_full.csv",
        "type": "SKU_IMPORT",
        "totalRows": 8934,
        "processedRows": 8934,
        "rowProcessingInfo": "8850 success, 84 errors, 0 warnings",
        "updatedAt": "2024-06-08 11:58:12"
      },
      {
        "id": "PROC-20240607-033",
        "createdAt": "2024-06-07 13:45:20",
        "status": "COMPLETED",
        "inputFile": "competitor_pricing_snapshot.xlsx",
        "type": "COMPETITOR_DATA",
        "totalRows": 3215,
        "processedRows": 3215,
        "rowProcessingInfo": "3190 success, 15 errors, 10 warnings",
        "updatedAt": "2024-06-07 14:22:41"
      }
    ],
    "fields": [
      {
        "key": "type",
        "label": "Type",
        "type": "select",
        "required": true,
        "options": [
          "Available via ProcessTypeResource autocomplete - types loaded from API"
        ]
      },
      {
        "key": "inputFile",
        "label": "File",
        "type": "text",
        "required": true
      }
    ]
  },
  "tasks-projects": {
    "key": "tasks-projects",
    "title": "Projects",
    "addLabel": "New project",
    "search": "Search by project name",
    "filters": [
      "Name",
      "Status",
      "BoM",
      "Created at",
      "Updated at"
    ],
    "total": 847,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "BoM",
        "key": "bom"
      },
      {
        "label": "Status",
        "key": "status"
      },
      {
        "label": "Created at",
        "key": "creationDateTime"
      },
      {
        "label": "Updated at",
        "key": "lastUpdatedDateTime"
      },
      {
        "label": "Created by",
        "key": "createdBy"
      },
      {
        "label": "Updated by",
        "key": "lastUpdatedBy"
      }
    ],
    "rows": [
      {
        "id": "proj-2024-001",
        "name": "Coca Cola Refresh Campaign",
        "bom": "BOM-2024-CC-001",
        "status": "active",
        "creationDateTime": "2024-01-15 09:30",
        "lastUpdatedDateTime": "2024-06-10 14:22",
        "createdBy": "alice.johnson",
        "lastUpdatedBy": "bob.smith"
      },
      {
        "id": "proj-2024-002",
        "name": "Pepsi Summer Launch",
        "bom": "BOM-2024-PS-002",
        "status": "active",
        "creationDateTime": "2024-02-20 11:15",
        "lastUpdatedDateTime": "2024-06-08 16:45",
        "createdBy": "charlie.brown",
        "lastUpdatedBy": "diana.prince"
      },
      {
        "id": "proj-2024-003",
        "name": "Sprite Zero Relaunch",
        "bom": "BOM-2024-SZ-003",
        "status": "archived",
        "creationDateTime": "2023-11-05 08:00",
        "lastUpdatedDateTime": "2024-03-12 10:30",
        "createdBy": "edward.norton",
        "lastUpdatedBy": "fiona.green"
      },
      {
        "id": "proj-2024-004",
        "name": "Minute Maid Regional Distribution",
        "bom": "BOM-2024-MM-004",
        "status": "active",
        "creationDateTime": "2024-04-01 13:45",
        "lastUpdatedDateTime": "2024-06-09 09:20",
        "createdBy": "george.martin",
        "lastUpdatedBy": "helen.stewart"
      },
      {
        "id": "proj-2024-005",
        "name": "Dasani Bottled Water Expansion",
        "bom": "BOM-2024-DW-005",
        "status": "draft",
        "creationDateTime": "2024-05-22 15:10",
        "lastUpdatedDateTime": "2024-06-07 11:55",
        "createdBy": "ian.cooper",
        "lastUpdatedBy": "jane.williams"
      },
      {
        "id": "proj-2024-006",
        "name": "Fanta Flavor Innovation Test",
        "bom": "BOM-2024-FF-006",
        "status": "active",
        "creationDateTime": "2024-03-18 10:20",
        "lastUpdatedDateTime": "2024-06-10 13:05",
        "createdBy": "karen.davis",
        "lastUpdatedBy": "alice.johnson"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "bom",
        "label": "BoM",
        "type": "text",
        "required": false
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Active",
          "Inactive"
        ]
      }
    ],
    "notice": "The Tasks section is being replaced by the new Seeds API. The migration is rolling out over the coming weeks — new configuration should be created in Seeds API."
  },
  "tasks-jobs": {
    "key": "tasks-jobs",
    "title": "Jobs",
    "addLabel": "New job",
    "search": "Search by Job name",
    "filters": [
      "Name",
      "Stores",
      "Seed",
      "Box",
      "Timeframe",
      "Geoloc modes",
      "Business units",
      "Has metadata",
      "Definition method",
      "Extraction types",
      "Type",
      "Parent jobs",
      "Expires before",
      "Status",
      "Extract reviews",
      "Extract marketplace",
      "Created at",
      "Updated at"
    ],
    "total": 247,
    "columns": [
      {
        "label": "Name",
        "key": "name"
      },
      {
        "label": "Store",
        "key": "store"
      },
      {
        "label": "Definition method",
        "key": "definitionMethod"
      },
      {
        "label": "Geolocation mode",
        "key": "geolocMode"
      },
      {
        "label": "Extraction type",
        "key": "extractionType"
      },
      {
        "label": "Type",
        "key": "type"
      },
      {
        "label": "Business unit",
        "key": "businessUnit"
      },
      {
        "label": "Has metadata",
        "key": "hasMetadata"
      },
      {
        "label": "Expiration date",
        "key": "expirationDate"
      },
      {
        "label": "Parent job",
        "key": "parentJob"
      },
      {
        "label": "Status",
        "key": "status"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      },
      {
        "label": "Created by",
        "key": "createdBy"
      },
      {
        "label": "Updated by",
        "key": "updatedBy"
      }
    ],
    "rows": [
      {
        "id": "job-001",
        "name": "Amazon Listings Scrape Q2",
        "store": "Amazon US",
        "definitionMethod": "BOX",
        "geolocMode": "GPS",
        "extractionType": "LISTINGS",
        "type": "BASE",
        "businessUnit": "Product Research",
        "hasMetadata": true,
        "expirationDate": "2026-12-31",
        "parentJob": "",
        "status": "ACTIVE",
        "createdAt": "2026-01-15T10:30:00Z",
        "updatedAt": "2026-06-08T14:22:00Z",
        "createdBy": "john.doe@company.com",
        "updatedBy": "jane.smith@company.com"
      },
      {
        "id": "job-002",
        "name": "Reviews Extraction - EU Markets",
        "store": "Europages",
        "definitionMethod": "SEED",
        "geolocMode": "COUNTRY",
        "extractionType": "REVIEWS",
        "type": "EXTENSION",
        "businessUnit": "Market Intelligence",
        "hasMetadata": false,
        "expirationDate": "2026-09-15",
        "parentJob": "Amazon Listings Scrape Q2",
        "status": "INACTIVE",
        "createdAt": "2026-02-20T09:15:00Z",
        "updatedAt": "2026-05-12T11:45:00Z",
        "createdBy": "alice.johnson@company.com",
        "updatedBy": "bob.williams@company.com"
      },
      {
        "id": "job-003",
        "name": "eBay Price Monitoring",
        "store": "eBay UK",
        "definitionMethod": "BOX",
        "geolocMode": "POSTAL_CODE",
        "extractionType": "PRICING",
        "type": "BASE",
        "businessUnit": "Competitive Analysis",
        "hasMetadata": true,
        "expirationDate": "2027-03-30",
        "parentJob": "",
        "status": "ACTIVE",
        "createdAt": "2025-11-08T16:20:00Z",
        "updatedAt": "2026-06-10T08:30:00Z",
        "createdBy": "michael.chen@company.com",
        "updatedBy": "michael.chen@company.com"
      },
      {
        "id": "job-004",
        "name": "Marketplace Inventory Check",
        "store": "Alibaba",
        "definitionMethod": "SEED",
        "geolocMode": "REGION",
        "extractionType": "INVENTORY",
        "type": "BASE",
        "businessUnit": "Supply Chain",
        "hasMetadata": false,
        "expirationDate": "2026-08-20",
        "parentJob": "",
        "status": "PENDING",
        "createdAt": "2026-03-05T13:45:00Z",
        "updatedAt": "2026-06-09T10:12:00Z",
        "createdBy": "sarah.miller@company.com",
        "updatedBy": "robert.taylor@company.com"
      },
      {
        "id": "job-005",
        "name": "Social Commerce Deep Dive",
        "store": "TikTok Shop",
        "definitionMethod": "BOX",
        "geolocMode": "CITY",
        "extractionType": "SOCIAL_DATA",
        "type": "EXTENSION",
        "businessUnit": "Social Media Team",
        "hasMetadata": true,
        "expirationDate": "2026-07-10",
        "parentJob": "Marketplace Inventory Check",
        "status": "ACTIVE",
        "createdAt": "2026-04-12T11:00:00Z",
        "updatedAt": "2026-06-07T15:33:00Z",
        "createdBy": "emma.davis@company.com",
        "updatedBy": "emma.davis@company.com"
      },
      {
        "id": "job-006",
        "name": "B2B Supplier Verification",
        "store": "Global Sources",
        "definitionMethod": "SEED",
        "geolocMode": "COUNTRY",
        "extractionType": "VERIFICATION",
        "type": "BASE",
        "businessUnit": "Procurement",
        "hasMetadata": true,
        "expirationDate": "2027-01-25",
        "parentJob": "",
        "status": "ARCHIVED",
        "createdAt": "2025-10-20T14:18:00Z",
        "updatedAt": "2026-04-03T09:50:00Z",
        "createdBy": "thomas.wilson@company.com",
        "updatedBy": "laura.martinez@company.com"
      }
    ],
    "fields": [
      {
        "key": "name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "key": "businessUnit",
        "label": "Business unit",
        "type": "select",
        "required": false,
        "options": [
          "UNKNOWN",
          "DIRECT_TO_CONSUMER",
          "DELIVERY",
          "MARKETPLACE",
          "QUICK_COMMERCE"
        ]
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Active",
          "Inactive"
        ]
      },
      {
        "key": "parent",
        "label": "Parent job",
        "type": "text",
        "required": false
      },
      {
        "key": "extractionType",
        "label": "Extraction type",
        "type": "text",
        "required": true
      },
      {
        "key": "store",
        "label": "Store",
        "type": "text",
        "required": true
      },
      {
        "key": "definitionMethod",
        "label": "Definition method",
        "type": "select",
        "required": true,
        "options": [
          "Seed",
          "Box"
        ]
      },
      {
        "key": "geolocMode",
        "label": "Geolocation mode",
        "type": "select",
        "required": true,
        "options": [
          "Manual",
          "Automatic",
          "No geoloc",
          "Virtual store"
        ]
      },
      {
        "key": "hasToExtractReviews",
        "label": "Extract reviews",
        "type": "checkbox",
        "required": false
      },
      {
        "key": "hasToExtractMarketplace",
        "label": "Extract marketplace",
        "type": "checkbox",
        "required": false
      },
      {
        "key": "expirationDate",
        "label": "Expiration date",
        "type": "date",
        "required": false
      },
      {
        "key": "hasMultivariant",
        "label": "PDP multivariants",
        "type": "checkbox",
        "required": false
      },
      {
        "key": "metadata",
        "label": "Metadata object",
        "type": "textarea",
        "required": false
      }
    ],
    "notice": "The Tasks section is being replaced by the new Seeds API. The migration is rolling out over the coming weeks — new configuration should be created in Seeds API."
  },
  "tasks-seeds": {
    "key": "tasks-seeds",
    "title": "Seeds",
    "addLabel": "Add seed",
    "search": "Search by Seed description",
    "filters": [
      "Description",
      "Ids",
      "Stores",
      "Jobs",
      "Boxes",
      "Category",
      "Status",
      "Is QA candidate",
      "Keyword",
      "Keyword types",
      "Brands",
      "Max pages",
      "Created at",
      "Updated at"
    ],
    "total": 342,
    "columns": [
      {
        "label": "Description",
        "key": "description"
      },
      {
        "label": "Keyword",
        "key": "keyword"
      },
      {
        "label": "Keyword type",
        "key": "keywordType"
      },
      {
        "label": "Max pages",
        "key": "maxPages"
      },
      {
        "label": "Max rank",
        "key": "maxRank"
      },
      {
        "label": "Brand",
        "key": "brand"
      },
      {
        "label": "Is QA candidate",
        "key": "isQaCandidate"
      },
      {
        "label": "Store",
        "key": "store"
      },
      {
        "label": "Category",
        "key": "category"
      },
      {
        "label": "Created at",
        "key": "createdAt"
      },
      {
        "label": "Updated at",
        "key": "updatedAt"
      },
      {
        "label": "Status",
        "key": "status"
      }
    ],
    "rows": [
      {
        "id": "seed-001",
        "description": "Organic Coffee Search",
        "keyword": "organic coffee beans",
        "keywordType": "GENERIC",
        "maxPages": "5",
        "maxRank": "100",
        "brand": "Lavazza",
        "isQaCandidate": true,
        "store": "Amazon Fresh",
        "category": "Beverages",
        "createdAt": "2026-05-15T10:30:00Z",
        "updatedAt": "2026-06-02T14:20:00Z",
        "status": "ACTIVE"
      },
      {
        "id": "seed-002",
        "description": "Premium Tea Varieties",
        "keyword": "oolong tea premium",
        "keywordType": "BRAND",
        "maxPages": "3",
        "maxRank": "50",
        "brand": "Harney & Sons",
        "isQaCandidate": false,
        "store": "Whole Foods",
        "category": "Beverages",
        "createdAt": "2026-04-20T09:15:00Z",
        "updatedAt": "2026-05-28T11:45:00Z",
        "status": "ACTIVE"
      },
      {
        "id": "seed-003",
        "description": "Energy Drink Market Research",
        "keyword": "energy drink red edition",
        "keywordType": "GENERIC",
        "maxPages": "10",
        "maxRank": "200",
        "brand": "Red Bull",
        "isQaCandidate": true,
        "store": "Target",
        "category": "Beverages",
        "createdAt": "2026-03-10T16:20:00Z",
        "updatedAt": "2026-06-01T08:30:00Z",
        "status": "INACTIVE"
      },
      {
        "id": "seed-004",
        "description": "Sparkling Water Competitor Analysis",
        "keyword": "sparkling water flavored",
        "keywordType": "GENERIC",
        "maxPages": "7",
        "maxRank": "150",
        "brand": "LaCroix",
        "isQaCandidate": false,
        "store": "Kroger",
        "category": "Beverages",
        "createdAt": "2026-02-14T13:00:00Z",
        "updatedAt": "2026-05-18T15:30:00Z",
        "status": "ACTIVE"
      },
      {
        "id": "seed-005",
        "description": "Specialty Coffee Blends",
        "keyword": "single origin coffee",
        "keywordType": "BRAND",
        "maxPages": "4",
        "maxRank": "75",
        "brand": "Blue Bottle",
        "isQaCandidate": true,
        "store": "Instacart",
        "category": "Beverages",
        "createdAt": "2026-01-22T07:45:00Z",
        "updatedAt": "2026-06-05T12:10:00Z",
        "status": "ACTIVE"
      },
      {
        "id": "seed-006",
        "description": "Juice Product Discovery",
        "keyword": "cold pressed juice organic",
        "keywordType": "GENERIC",
        "maxPages": "6",
        "maxRank": "120",
        "brand": "Naked Juice",
        "isQaCandidate": false,
        "store": "Walmart",
        "category": "Beverages",
        "createdAt": "2025-12-30T11:20:00Z",
        "updatedAt": "2026-04-25T09:55:00Z",
        "status": "ACTIVE"
      }
    ],
    "fields": [
      {
        "key": "description",
        "label": "Description",
        "type": "textarea",
        "required": true
      },
      {
        "key": "store",
        "label": "Store",
        "type": "text",
        "required": true
      },
      {
        "key": "category",
        "label": "Category",
        "type": "text",
        "required": true
      },
      {
        "key": "isQaCandidate",
        "label": "Is qa candidate",
        "type": "checkbox",
        "required": false
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Active",
          "Inactive"
        ]
      },
      {
        "key": "keyword",
        "label": "Keyword",
        "type": "text",
        "required": false
      },
      {
        "key": "keywordType",
        "label": "Keyword type",
        "type": "select",
        "required": false,
        "options": [
          "Category",
          "Branded"
        ]
      },
      {
        "key": "brand",
        "label": "Brand",
        "type": "text",
        "required": false
      },
      {
        "key": "url",
        "label": "URL",
        "type": "text",
        "required": false
      },
      {
        "key": "maxPages",
        "label": "Max pages",
        "type": "number",
        "required": false
      },
      {
        "key": "destination",
        "label": "Destination",
        "type": "text",
        "required": false
      },
      {
        "key": "apiOrigin",
        "label": "API origin",
        "type": "textarea",
        "required": false
      },
      {
        "key": "discoveryKey",
        "label": "Discovery key",
        "type": "text",
        "required": false
      },
      {
        "key": "isFromDiscovery",
        "label": "Is from discovery",
        "type": "checkbox",
        "required": false
      },
      {
        "key": "pageType",
        "label": "Page type",
        "type": "text",
        "required": false
      },
      {
        "key": "maxRank",
        "label": "Max rank",
        "type": "number",
        "required": false
      }
    ],
    "notice": "The Tasks section is being replaced by the new Seeds API. The migration is rolling out over the coming weeks — new configuration should be created in Seeds API."
  }
};
