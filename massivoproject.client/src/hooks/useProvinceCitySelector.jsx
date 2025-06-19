import { useEffect, useState } from "react";
import { getAllProvince } from "../api/ProvinceEndpoints";
import { getCitiesByProvince } from "../api/CityEndpoints";


const useProvinceCitySelector = () => {
    //Esto lo pueden usar para traerse en otros componentes la lista de provincias, o la lista de ciudades para una provincia determinada.
    //No hay cambios en los repo de provincias y ciudades, esto solo evita tener que repetir el fetch 
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState('');
    const [loadingProvinces, setLoadingProvinces] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await getAllProvince();
                setProvinces(response);
            } catch (err) {
                console.error("Error fetching provinces:", err.message);
            } finally {
                setLoadingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    const fetchCitiesForProvince = async (provinceId) => {
        setLoadingCities(true);
        try {
            const response = await getCitiesByProvince(provinceId);
            setCities(response);
        } catch (err) {
            console.error("Error fetching cities:", err.message);
        } finally {
            setLoadingCities(false);
        }
    };

    const handleProvinceChange = (provinceId) => {
        setSelectedProvinceId(provinceId);
        fetchCitiesForProvince(provinceId);
        setCities([]); 
    };

    return {
        provinces,
        cities,
        selectedProvinceId,
        loadingProvinces,
        loadingCities,
        handleProvinceChange,
    };
};

export default useProvinceCitySelector;
