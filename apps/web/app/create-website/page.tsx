"use client";

import { useEffect, useMemo, useState } from "react";

type CategoryNode = {
    id?: string;
    name: string;
    slug?: string;
    ctaType?: string;
    sitemapTemplate?: unknown;
    parent?: CategoryNode | null;
    children?: CategoryNode[];
};

type WebsitePayload = {
    category: CategoryNode;
    name: string;
    city: string;
    phone?: string;
    whatsapp?: string;
    address: {
        city: string;
        address: string;
        state: string;
        country: string;
        postalCode: string;
    };
    language: string;
    positioningTier: string;
    positioningDetail?: string;
    status?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const LANG_OPTIONS = ["english", "hindi", "marathi"];
const TIER_OPTIONS = ["Very fast", "Fast", "Balanced", "Premium", "Budget friendly"];
const STATUS_OPTIONS = ["Draft", "Published"];

const COACHING_TYPES = ["Offline", "Online", "Hybrid", "One-to-one", "Group Batch"];
const SUBJECT_OPTIONS = [
    "Maths",
    "Science",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Accounts",
    "Coding",
];
const GRADE_OPTIONS = ["Class 6-8", "Class 9-10", "Class 11-12", "College", "Competitive"];
const EXAM_OPTIONS = ["Boards", "JEE", "NEET", "CET", "Olympiad", "Foundation"];
const BATCH_OPTIONS = ["Weekday", "Weekend", "Morning", "Evening", "Crash Course"];
const FEE_OPTIONS = ["< 2,000/month", "2,000-5,000", "5,000-10,000", "10,000+"];
const RESULT_OPTIONS = ["Excellent", "Good", "Average", "Building Track Record"];

const INDIA_SOCIAL_SOURCES = [
    "website",
    "google_business_profile",
    "instagram",
    "facebook",
    "whatsapp_business",
    "youtube",
    "x_twitter",
    "linkedin",
    "zomato",
    "swiggy",
    "justdial",
    "indiamart",
    "sulekha",
    "tripadvisor",
];

const PRIMARY_CATEGORIES = ["Coaching classes", "Restaurant", "Clinic", "Salons"];

const toTitle = (v: string) =>
    v
        .split("_")
        .join(" ")
        .replace(/\b\w/g, (m) => m.toUpperCase());

const normalize = (v: string) => v.trim().toLowerCase().replace(/\s+/g, " ");

const isCoachingCategory = (name?: string) => {
    const n = normalize(name ?? "");
    return n === "coaching classes" || n === "coaching class" || n === "coaching";
};

export default function CreateWebsitePage() {
    const [slide, setSlide] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [selectedSubCategoryName, setSelectedSubCategoryName] = useState("");

    const [businessId, setBusinessId] = useState("");
    const [authToken, setAuthToken] = useState("");

    const [websiteForm, setWebsiteForm] = useState({
        name: "gladcode",
        city: "nagpur",
        phone: "9049606217",
        whatsapp: "9049606217",
        address: "nagpur something",
        addressCity: "Nagpur",
        state: "MH",
        country: "India",
        postalCode: "440013",
        language: "english",
        positioningTier: "Very fast",
        positioningDetail: "Very Very fast",
        status: "Draft",
    });

    const [coachingForm, setCoachingForm] = useState({
        coachingType: "Hybrid",
        subjects: ["Maths", "Science"] as string[],
        targetGrades: ["Class 9-10"] as string[],
        examFocus: ["Boards"] as string[],
        batchTypes: ["Weekday"] as string[],
        demoClassAvailable: true,
        resultTrackRecord: "Good",
        studentsPerBatch: "30",
        facultyCount: "6",
        feeRange: "2,000-5,000",
        hasOnlineMode: true,
    });

    const [sourceUrls, setSourceUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/categories`);
                if (!res.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = (await res.json()) as CategoryNode[] | { categories?: CategoryNode[] };
                const parsed = Array.isArray(data) ? data : data.categories ?? [];
                setCategories(parsed);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Unable to load categories";
                setError(msg);
            }
        };
        void fetchCategories();
    }, []);

    const selectedCategory = useMemo(
        () => categories.find((c) => normalize(c.name) === normalize(selectedCategoryName)),
        [categories, selectedCategoryName],
    );
    const selectedSubCategory = useMemo(
        () =>
            selectedCategory?.children?.find(
                (child) => normalize(child.name) === normalize(selectedSubCategoryName),
            ) ?? null,
        [selectedCategory, selectedSubCategoryName],
    );
    const effectiveCategory = selectedSubCategory ?? selectedCategory ?? null;
    const showCoachingQuestions = isCoachingCategory(selectedCategory?.name);

    const withAuthHeaders = (json = true): HeadersInit => {
        const headers: Record<string, string> = {};
        if (json) headers["Content-Type"] = "application/json";
        if (authToken.trim()) headers.Authorization = `Bearer ${authToken.trim()}`;
        return headers;
    };

    const toggleMulti = (
        list: string[],
        value: string,
        setter: (next: string[]) => void,
        atLeastOne = true,
    ) => {
        const exists = list.includes(value);
        if (exists) {
            if (atLeastOne && list.length === 1) return;
            setter(list.filter((item) => item !== value));
            return;
        }
        setter([...list, value]);
    };

    const submitWebsiteInfo = async () => {
        // if (!effectiveCategory) {
        //   setError("Please choose a category (and sub-category if needed).");
        //   return;
        // }

        setBusy(true);
        setError(null);
        setSuccess(null);
        try {
            const payload: WebsitePayload = {
                category: effectiveCategory,
                name: websiteForm.name.trim(),
                city: websiteForm.city.trim(),
                phone: websiteForm.phone.trim() || undefined,
                whatsapp: websiteForm.whatsapp.trim() || undefined,
                address: {
                    city: websiteForm.addressCity.trim(),
                    address: websiteForm.address.trim(),
                    state: websiteForm.state.trim(),
                    country: websiteForm.country.trim(),
                    postalCode: websiteForm.postalCode.trim(),
                },
                language: websiteForm.language,
                positioningTier: websiteForm.positioningTier,
                positioningDetail: websiteForm.positioningDetail.trim() || undefined,
                status: websiteForm.status,
            };

            const res = await fetch(`${API_BASE_URL}/api/init-website`, {
                method: "POST",
                headers: withAuthHeaders(),
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "Failed to save business information");
            }

            const data = (await res.json()) as { business?: { id?: string } };
            const id = data.business?.id;
            if (!id) throw new Error("Business ID missing in response");
            setBusinessId(id);
            setSuccess("Business info saved. Continue to category questions.");
            setSlide(1);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const submitCoachingQuestions = async () => {
        if (!businessId) {
            setError("Business ID missing. Complete page 1 first.");
            return;
        }
        if (!showCoachingQuestions) {
            setSlide(2);
            return;
        }

        setBusy(true);
        setError(null);
        setSuccess(null);
        try {
            const payload = {
                businessId,
                coachingType: coachingForm.coachingType,
                subjects: coachingForm.subjects,
                targetGrades: coachingForm.targetGrades,
                examFocus: coachingForm.examFocus,
                batchTypes: coachingForm.batchTypes,
                demoClassAvailable: coachingForm.demoClassAvailable,
                resultTrackRecord: coachingForm.resultTrackRecord || undefined,
                studentsPerBatch: coachingForm.studentsPerBatch
                    ? Number(coachingForm.studentsPerBatch)
                    : undefined,
                facultyCount: coachingForm.facultyCount ? Number(coachingForm.facultyCount) : undefined,
                feeRange: coachingForm.feeRange || undefined,
                hasOnlineMode: coachingForm.hasOnlineMode,
            };

            const res = await fetch(`${API_BASE_URL}/api/init-category-questions`, {
                method: "POST",
                headers: withAuthHeaders(),
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "Failed to save category questions");
            }

            setSuccess("Category questions saved.");
            setSlide(2);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const submitDataSources = async () => {
        if (!businessId) {
            setError("Business ID missing. Complete previous pages first.");
            return;
        }

        setBusy(true);
        setError(null);
        setSuccess(null);
        try {
            const items = Object.entries(sourceUrls)
                .map(([sourceType, url]) => ({ sourceType, url: url.trim() }))
                .filter((x) => x.url.length > 0)
                .map((x) => ({
                    businessId,
                    sourceType: x.sourceType,
                    url: x.url,
                    scrapedAt: new Date().toISOString(),
                }));

            if (items.length === 0) {
                setSuccess("No data sources provided (all optional).");
                return;
            }

            const res = await fetch(`${API_BASE_URL}/api/init-data-sources`, {
                method: "POST",
                headers: withAuthHeaders(),
                body: JSON.stringify(items),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "Failed to save business data sources");
            }

            setSuccess("Business data sources saved successfully.");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const chip = (active: boolean) =>
        `rounded-full border px-4 py-2 text-sm transition ${active
            ? "border-emerald-600 bg-emerald-100 text-emerald-900"
            : "border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
        }`;

    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50 p-4 sm:p-8">
            <section className="mx-auto max-w-5xl rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-lg backdrop-blur sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold text-slate-800">Create Website</h1>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        Slide {slide + 1} / 3
                    </div>
                </div>

                <div className="mb-6 h-2 w-full rounded-full bg-slate-100">
                    <div
                        className="h-2 rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${((slide + 1) / 3) * 100}%` }}
                    />
                </div>

                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-2 text-sm font-medium text-slate-700">Auth token (for protected routes)</p>
                    <input
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-black placeholder:text-slate-400 outline-none ring-emerald-200 focus:ring"
                        placeholder="Paste JWT token (optional for categories, needed for submit routes)"
                    />
                </div>

                {error ? <p className="mb-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
                {success ? (
                    <p className="mb-3 rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{success}</p>
                ) : null}

                {slide === 0 ? (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800">1) Business Information</h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-1 block text-slate-700">Category (field)</span>
                                <input
                                    list="category-options"
                                    value={selectedCategoryName}
                                    onChange={(e) => {
                                        setSelectedCategoryName(e.target.value);
                                        setSelectedSubCategoryName("");
                                    }}
                                    placeholder="Select or type category"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black placeholder:text-slate-400 outline-none ring-emerald-200 focus:ring"
                                />
                                <datalist id="category-options">
                                    {PRIMARY_CATEGORIES.map((name) => (
                                        <option key={name} value={name} />
                                    ))}
                                </datalist>
                            </label>

                            <label className="text-sm">
                                <span className="mb-1 block text-slate-700">Sub Category (field)</span>
                                <input
                                    list="subcategory-options"
                                    value={selectedSubCategoryName}
                                    onChange={(e) => setSelectedSubCategoryName(e.target.value)}
                                    placeholder="Select or type sub category"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black placeholder:text-slate-400 outline-none ring-emerald-200 focus:ring"
                                />
                                <datalist id="subcategory-options">
                                    {(selectedCategory?.children ?? []).map((child) => (
                                        <option key={child.id ?? child.name} value={child.name} />
                                    ))}
                                </datalist>
                            </label>
                        </div>

                        <div>
                            <p className="mb-2 font-medium text-slate-700">Choose Category</p>
                            <div className="flex flex-wrap gap-2">
                                {PRIMARY_CATEGORIES.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        className={chip(normalize(selectedCategoryName) === normalize(name))}
                                        onClick={() => {
                                            setSelectedCategoryName(name);
                                            setSelectedSubCategoryName("");
                                        }}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedCategory?.children?.length ? (
                            <div>
                                <p className="mb-2 font-medium text-slate-700">Choose Sub Category</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategory.children.map((child) => (
                                        <button
                                            key={child.id ?? child.name}
                                            type="button"
                                            className={chip(selectedSubCategoryName === child.name)}
                                            onClick={() => setSelectedSubCategoryName(child.name)}
                                        >
                                            {toTitle(child.name)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                ["Business Name", "name"],
                                ["City", "city"],
                                ["Phone", "phone"],
                                ["WhatsApp", "whatsapp"],
                                ["Address", "address"],
                                ["Address City", "addressCity"],
                                ["State", "state"],
                                ["Country", "country"],
                                ["Postal Code", "postalCode"],
                                ["Positioning Detail", "positioningDetail"],
                            ].map(([label, key]) => (
                                <label key={key} className="text-sm">
                                    <span className="mb-1 block text-slate-700">{label}</span>
                                    <input
                                        value={websiteForm[key as keyof typeof websiteForm]}
                                        onChange={(e) =>
                                            setWebsiteForm((prev) => ({ ...prev, [key]: e.target.value }))
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black placeholder:text-slate-400 outline-none ring-emerald-200 focus:ring"
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-700">Language</p>
                                <div className="flex flex-wrap gap-2">
                                    {LANG_OPTIONS.map((lang) => (
                                        <button
                                            key={lang}
                                            type="button"
                                            className={chip(websiteForm.language === lang)}
                                            onClick={() => setWebsiteForm((prev) => ({ ...prev, language: lang }))}
                                        >
                                            {toTitle(lang)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-700">Positioning Tier</p>
                                <div className="flex flex-wrap gap-2">
                                    {TIER_OPTIONS.map((tier) => (
                                        <button
                                            key={tier}
                                            type="button"
                                            className={chip(websiteForm.positioningTier === tier)}
                                            onClick={() => setWebsiteForm((prev) => ({ ...prev, positioningTier: tier }))}
                                        >
                                            {tier}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-700">Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {STATUS_OPTIONS.map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            className={chip(websiteForm.status === status)}
                                            onClick={() => setWebsiteForm((prev) => ({ ...prev, status }))}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void submitWebsiteInfo()}
                                className="rounded-xl bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {busy ? "Saving..." : "Save & Next"}
                            </button>
                        </div>
                    </div>
                ) : null}

                {slide === 1 ? (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800">2) Category Questions</h2>

                        {!showCoachingQuestions ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-slate-700">
                                    You selected <strong>{selectedCategory?.name || "another category"}</strong>. For
                                    now only <strong>coaching classes</strong> questions are available.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSlide(0)}
                                    className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
                                >
                                    Back
                                </button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Coaching Type</p>
                                    <div className="flex flex-wrap gap-2">
                                        {COACHING_TYPES.map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className={chip(coachingForm.coachingType === type)}
                                                onClick={() =>
                                                    setCoachingForm((prev) => ({
                                                        ...prev,
                                                        coachingType: type,
                                                    }))
                                                }
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {[
                                    { label: "Subjects", options: SUBJECT_OPTIONS, key: "subjects" as const },
                                    { label: "Target Grades", options: GRADE_OPTIONS, key: "targetGrades" as const },
                                    { label: "Exam Focus", options: EXAM_OPTIONS, key: "examFocus" as const },
                                    { label: "Batch Types", options: BATCH_OPTIONS, key: "batchTypes" as const },
                                ].map(({ label, options, key }) => (
                                    <div key={key}>
                                        <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {options.map((option) => {
                                                const values = coachingForm[key];
                                                return (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        className={chip(values.includes(option))}
                                                        onClick={() =>
                                                            toggleMulti(values, option, (next) =>
                                                                setCoachingForm((prev) => ({ ...prev, [key]: next })),
                                                            )
                                                        }
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Result Track Record</p>
                                    <div className="flex flex-wrap gap-2">
                                        {RESULT_OPTIONS.map((result) => (
                                            <button
                                                key={result}
                                                type="button"
                                                className={chip(coachingForm.resultTrackRecord === result)}
                                                onClick={() =>
                                                    setCoachingForm((prev) => ({
                                                        ...prev,
                                                        resultTrackRecord: result,
                                                    }))
                                                }
                                            >
                                                {result}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Fee Range</p>
                                    <div className="flex flex-wrap gap-2">
                                        {FEE_OPTIONS.map((fee) => (
                                            <button
                                                key={fee}
                                                type="button"
                                                className={chip(coachingForm.feeRange === fee)}
                                                onClick={() =>
                                                    setCoachingForm((prev) => ({
                                                        ...prev,
                                                        feeRange: fee,
                                                    }))
                                                }
                                            >
                                                {fee}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="text-sm">
                                        <span className="mb-1 block text-slate-700">Students Per Batch</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={coachingForm.studentsPerBatch}
                                            onChange={(e) =>
                                                setCoachingForm((prev) => ({
                                                    ...prev,
                                                    studentsPerBatch: e.target.value,
                                                }))
                                            }
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black placeholder:text-slate-400 outline-none ring-emerald-200 focus:ring"
                                        />
                                    </label>
                                    <label className="text-sm">
                                        <span className="mb-1 block text-slate-700">Faculty Count</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={coachingForm.facultyCount}
                                            onChange={(e) =>
                                                setCoachingForm((prev) => ({
                                                    ...prev,
                                                    facultyCount: e.target.value,
                                                }))
                                            }
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black placeholder:text-slate-400 outline-none ring-emerald-200 focus:ring"
                                        />
                                    </label>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        ["Demo Class Available", "demoClassAvailable"],
                                        ["Has Online Mode", "hasOnlineMode"],
                                    ].map(([label, key]) => (
                                        <div key={key}>
                                            <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
                                            <div className="flex gap-2">
                                                {[true, false].map((value) => (
                                                    <button
                                                        key={`${key}-${String(value)}`}
                                                        type="button"
                                                        className={chip(Boolean(coachingForm[key as keyof typeof coachingForm]) === value)}
                                                        onClick={() =>
                                                            setCoachingForm((prev) => ({
                                                                ...prev,
                                                                [key]: value,
                                                            }))
                                                        }
                                                    >
                                                        {value ? "Yes" : "No"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setSlide(0)}
                                className="rounded-xl border border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-100"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void submitCoachingQuestions()}
                                className="rounded-xl bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {busy ? "Saving..." : showCoachingQuestions ? "Save & Next" : "Skip & Next"}
                            </button>
                        </div>
                    </div>
                ) : null}

                {slide === 2 ? (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800">3) Business Data Sources (Optional)</h2>
                        <p className="text-sm text-slate-600">
                            Add any social/listing links available for this business in India. Leave empty if not available.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {INDIA_SOCIAL_SOURCES.map((source) => (
                                <label key={source} className="text-sm">
                                    <span className="mb-1 block text-slate-700">{toTitle(source)}</span>
                                    <input
                                        type="url"
                                        value={sourceUrls[source] ?? ""}
                                        onChange={(e) =>
                                            setSourceUrls((prev) => ({
                                                ...prev,
                                                [source]: e.target.value,
                                            }))
                                        }
                                        placeholder={`https://...`}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black placeholder:text-slate-400 outline-none ring-emerald-200 focus:ring"
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setSlide(1)}
                                className="rounded-xl border border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-100"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void submitDataSources()}
                                className="rounded-xl bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {busy ? "Submitting..." : "Finish"}
                            </button>
                        </div>
                    </div>
                ) : null}
            </section>
        </main>
    );
}