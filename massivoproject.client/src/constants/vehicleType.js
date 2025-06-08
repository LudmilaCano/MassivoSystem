export const VEHICLE_TYPE_IMAGES = {
    Combi: "https://360views.3dmodels.org/zoom/Toyota/Toyota_Hiace_Mk5f_H200_LWB_Combi_2013_1000_0001.jpg", 
    Minibus: "https://mercoturismo.com/web/wp-content/uploads/elementor/thumbs/minibus-24-pasajeros-ptnvwqdsdb2mylordwd9d6h6b2bussixjxnxppgy10.png", 
    Auto: "https://infonegocios.info/content/images/2022/07/22/300701/conversions/geely-salta-2-medium-size.jpg", 
    Colectivo: "https://motormagazine.com.ar/wp-content/uploads/2020/10/chasis-Volvo-B450-6x2-con-tercer-eje-direccional-para-omnibus-de-15-metros-1.jpg"
};

export function getVehicleTypeImage(type) {    
    const key = type.trim();
    return VEHICLE_TYPE_IMAGES[key];
}

export const VEHICLE_TYPE_LABELS = {
    Combi: "Combi",
    MiniBus: "Mini Bus",
    Auto: "Auto",
    Colectivo: "Colectivo"
};

export const VEHICLE_TYPE_ICONS = {
    Combi: "🚐",
    MiniBus: "🚌",
    Auto: "🚗",
    Colectivo: "🚍"
};

export const VEHICLE_TYPE_ENUM = {
    Combi: 0,
    MiniBus: 1,
    Auto: 2,
    Colectivo: 3
};
export function getVehicleTypeValue(type) {
    return VEHICLE_TYPE_ENUM[type] ?? type;
}
export function getVehicleTypeLabel(type) {
    if (typeof type === "number") {
        const key = VEHICLE_TYPE_ENUM[type];
        return VEHICLE_TYPE_LABELS[key] || key || type;
    }
    return VEHICLE_TYPE_LABELS[type] || type;
}