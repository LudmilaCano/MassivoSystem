export const VEHICLE_TYPE_IMAGES = {
    combi: "https://dieselsanmiguel.com.ar/img/clases/small/45-img_sec-45-img_sec-sprinter_combi_180220_secundaria_02.jpg", 
    minibus: "https://mercoturismo.com/web/wp-content/uploads/elementor/thumbs/minibus-24-pasajeros-ptnvwqdsdb2mylordwd9d6h6b2bussixjxnxppgy10.png", 
    auto: "https://infonegocios.info/content/images/2022/07/22/300701/conversions/geely-salta-2-medium-size.jpg", 
    colectivo: "https://motormagazine.com.ar/wp-content/uploads/2020/10/chasis-Volvo-B450-6x2-con-tercer-eje-direccional-para-omnibus-de-15-metros-1.jpg"
};

export function getVehicleTypeImage(type) {
    if (!type) return VEHICLE_TYPE_IMAGES.auto;
    const key = type.toLowerCase();
    return VEHICLE_TYPE_IMAGES[key] || VEHICLE_TYPE_IMAGES.auto;
}