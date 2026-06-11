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
    "total": 127,
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
      {
        "id": "bu-001",
        "name": "North America Operations",
        "client": "Coca-Cola Enterprises",
        "createdAt": "2024-03-15 14:22:00",
        "updatedAt": "2024-11-08 09:45:30"
      },
      {
        "id": "bu-002",
        "name": "EMEA Distribution Hub",
        "client": "Nestlé Global",
        "createdAt": "2023-11-22 08:15:45",
        "updatedAt": "2024-10-20 16:32:00"
      },
      {
        "id": "bu-003",
        "name": "Asia-Pacific Sales",
        "client": "PepsiCo International",
        "createdAt": "2024-01-10 11:30:00",
        "updatedAt": "2024-12-01 13:18:22"
      },
      {
        "id": "bu-004",
        "name": "Latin America Retail",
        "client": "Unilever Ltd",
        "createdAt": "2023-08-05 10:00:00",
        "updatedAt": "2024-09-17 14:55:00"
      },
      {
        "id": "bu-005",
        "name": "UK & Ireland Logistics",
        "client": "Mars Inc.",
        "createdAt": "2024-02-28 15:45:30",
        "updatedAt": "2024-11-25 10:12:15"
      },
      {
        "id": "bu-006",
        "name": "Central Europe Manufacturing",
        "client": "Ferrero SpA",
        "createdAt": "2023-09-12 09:20:00",
        "updatedAt": "2024-10-03 11:40:45"
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
    "total": 127,
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
      {
        "id": "cat-001",
        "name": "Premium Beverages",
        "client": "Coca-Cola",
        "createdAt": "2025-08-12 14:23:45",
        "updatedAt": "2025-12-01 09:15:32"
      },
      {
        "id": "cat-002",
        "name": "Seasonal Products",
        "client": "Nestle",
        "createdAt": "2025-09-03 10:42:18",
        "updatedAt": "2026-01-15 16:48:22"
      },
      {
        "id": "cat-003",
        "name": "Energy Drinks",
        "client": "Red Bull",
        "createdAt": "2025-07-21 08:19:56",
        "updatedAt": "2025-11-28 11:33:14"
      },
      {
        "id": "cat-004",
        "name": "Organic & Natural",
        "client": "PepsiCo",
        "createdAt": "2025-10-15 13:05:42",
        "updatedAt": "2026-02-03 14:27:58"
      },
      {
        "id": "cat-005",
        "name": "Limited Edition",
        "client": "Coca-Cola",
        "createdAt": "2025-11-02 15:36:20",
        "updatedAt": "2026-03-10 10:12:44"
      },
      {
        "id": "cat-006",
        "name": "Health & Wellness",
        "client": "Danone",
        "createdAt": "2025-06-18 09:47:33",
        "updatedAt": "2025-12-22 13:58:09"
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
        "label": "Url",
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
        "label": "Api origin",
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
