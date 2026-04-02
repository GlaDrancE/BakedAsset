import { z } from "zod"

export const facultyDetailsSchema = z.object({
    name: z.string().min(1),
    photoAssetId: z.string().min(1),
    qualification: z.string().min(1),
    specialization: z.array(z.string().min(1)).nonempty(),
    experienceYears: z.number().int().positive(),
    achievement: z.string().optional(),
});
export const coachingDetailsSchema = z.object({
    businessId: z.string(),
    coachingType: z.string().min(1),
    subjects: z.array(z.string().min(1)).nonempty(),
    targetGrades: z.array(z.string().min(1)).nonempty(),
    examFocus: z.array(z.string().min(1)).nonempty(),
    batchTypes: z.array(z.string().min(1)).nonempty(),
    demoClassAvailable: z.boolean().default(false),
    resultTrackRecord: z.string().optional(),
    studentsPerBatch: z.number().int().positive().optional(),
    facultyCount: z.number().int().positive().optional(),
    feeRange: z.string().optional(),
    hasOnlineMode: z.boolean().default(false),
    facultyDetails: z.array(facultyDetailsSchema).optional(),
});


export const restaurantDetailsSchema = z.object({
    businessId: z.string().uuid(),

    subType: z.enum([
        "fine_dining",
        "casual",
        "cloud_kitchen",
        "street_food",
        "cafe",
    ]),

    experienceType: z.enum([
        "quick_bite",
        "casual",
        "celebration",
        "romantic",
    ]),

    serviceSpeed: z.enum([
        "fast",
        "moderate",
        "leisurely",
    ]),

    targetAudience: z.enum([
        "families",
        "couples",
        "office_lunch",
        "students",
    ]),

    cuisineTypes: z.array(z.string().min(1)).min(1),

    avgPriceForTwo: z.number().int().min(0).optional(),

    hasDelivery: z.boolean().default(false),

    deliveryPlatforms: z.array(z.enum([
        "zomato",
        "swiggy",
        "ubereats",
        "own_delivery",
    ])).default([]),

    menuHighlights: z.array(z.string().min(1)).default([]),

    specialOfferings: z.array(z.string().min(1)).default([]),

    acceptsReservation: z.boolean().default(false),
});

export const clinicDetailsSchema = z.object({
    businessId: z.string().uuid(),

    clinicType: z.enum([
        "general",
        "specialist",
        "cosmetic",
        "diagnostic",
    ]),

    specialty: z.string().optional(),

    doctorName: z.string().min(1),

    qualification: z.string().optional(),

    experienceYears: z.number().int().min(0).max(60).optional(),

    appointmentType: z.enum([
        "walkin",
        "appointment_only",
        "both",
    ]),

    targetPatient: z.enum([
        "children",
        "adults",
        "elderly",
        "all",
    ]),

    services: z.array(z.string().min(1)).min(1),

    insuranceAccepted: z.boolean().default(false),

    consultationFeeRange: z.string().max(100).optional(),

    hasDiagnosticLab: z.boolean().default(false),
});


export const salonDetailsSchema = z.object({
    businessId: z.string().uuid(),

    salonType: z.enum([
        "unisex",
        "ladies",
        "gents",
        "bridal",
    ]),

    priceRange: z.enum([
        "budget",
        "mid",
        "premium",
    ]),

    targetCustomer: z.string().min(1),

    ambianceType: z.enum([
        "luxury",
        "friendly",
        "quick",
    ]),

    services: z.array(z.string().min(1)).min(1),

    hasBridalPackage: z.boolean().default(false),

    appointmentRequired: z.boolean().default(false),

    hasTrainedStylists: z.boolean().default(false),

    specialtyTreatments: z.array(z.string().min(1)).default([]),
});
