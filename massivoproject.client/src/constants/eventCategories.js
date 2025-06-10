export const EVENT_TYPE_LABELS = {
    Music: "Música",
    Entertainment: "Entretenimiento",
    Sport: "Deporte",
    Business: "Negocios",
    Convention: "Convención",
    Festival: "Festival",
    FoodAndDrink: "Gastronomía",
    Gaming: "Gaming",
    Outdoor: "Aire libre",
    Wellness: "Bienestar",
    Cultural: "Cultural",
    Technology: "Tecnología"
};

export const EVENT_TYPE_ENUM = [
    "Music",
    "Entertainment",
    "Sport",
    "Business",
    "Convention",
    "Festival",
    "FoodAndDrink",
    "Gaming",
    "Outdoor",
    "Wellness",
    "Cultural",
    "Technology"
];

export const EVENT_TYPE_ICONS = {
    Music: "🎵",
    Entertainment: "🎭",
    Sport: "🏟️",
    Business: "💼",
    Convention: "🏛️",
    Festival: "🎉",
    FoodAndDrink: "🍔",
    Gaming: "🎮",
    Outdoor: "🏕️",
    Wellness: "🧘",
    Cultural: "🏺",
    Technology: "💻"
};
export function getEventTypeLabel(type) {
    if (typeof type === "number") {
        const key = EVENT_TYPE_ENUM[type];
        return EVENT_TYPE_LABELS[key] || key || type;
    }
    return EVENT_TYPE_LABELS[type] || type;
}

export function getEventTypeIcon(type) {
    if (typeof type === "number") {
        const key = EVENT_TYPE_ENUM[type];
        return EVENT_TYPE_ICONS[key] || "❓";
    }
    return EVENT_TYPE_ICONS[type] || "❓";
}

