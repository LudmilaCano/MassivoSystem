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

export function getEventTypeLabel(type) {
    // Si es número, lo convertimos a string usando el array
    if (typeof type === "number") {
        const key = EVENT_TYPE_ENUM[type];
        return EVENT_TYPE_LABELS[key] || key || type;
    }
    // Si es string, lo buscamos directo
    return EVENT_TYPE_LABELS[type] || type;
}