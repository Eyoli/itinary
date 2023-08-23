"use client"

import {useState} from "react";
import {ReactSearchAutocomplete} from "react-search-autocomplete";
import {RouteData} from "@/src/services/gtfs";
import {useRouter} from "next/navigation";

type Item = {
    id: string,
    name: string
}

export default function RouteSearch({routes}: { routes: RouteData[] }) {

    const items = routes.map((r) => ({id: r.route_id, name: r.route_long_name}))

    const router = useRouter()

    const [routeId, setRouteId] = useState<string>()

    const handleOnSelectRoute = (result: Item) => {
        result && setRouteId(result.id)
    }

    const handleOnSearch = () => {
        routeId && router.push(`/routes/${routeId}`)
    }

    return (
        <form>
            <div className="md:flex md:items-center">
                <div className="md:w-1/4">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Route name
                    </label>
                </div>
                <div className="md:w-2/4 mr-5 z-40">
                    <ReactSearchAutocomplete
                        styling={{borderRadius: "0.375rem", boxShadow: "none"}}
                        items={items}
                        onSelect={handleOnSelectRoute}
                        autoFocus
                        fuseOptions={{distance: 0}}
                    />
                </div>
                <div className="md:w-1/4">
                    <button
                        className="btn btn-primary"
                        type="button" onClick={handleOnSearch}>
                        Search
                    </button>
                </div>
            </div>
        </form>
    )
}