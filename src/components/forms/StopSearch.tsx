"use client"

import {useState} from "react";
import {ReactSearchAutocomplete} from "react-search-autocomplete";
import {StopData} from "@/src/services/gtfs";
import {useRouter} from "next/navigation";

export default function StopSearch({stops}: { stops: StopData[] }) {

    const router = useRouter()

    const [stopId, setStopId] = useState<string>()

    const handleOnSelectRoute = (result: StopData) => {
        result && setStopId(result.stop_id)
    }

    const handleOnSearch = () => {
        stopId && router.push(`/stops/${stopId}`)
    }

    return (
        <form>
            <div className="md:flex md:items-center">
                <div className="md:w-1/4">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Stop name
                    </label>
                </div>
                <div className="md:w-2/4 mr-5 z-30">
                    <ReactSearchAutocomplete
                        styling={{borderRadius: "0.375rem", boxShadow: "none"}}
                        items={stops}
                        onSelect={handleOnSelectRoute}
                        resultStringKeyName="stop_name"
                        autoFocus
                        fuseOptions={{minMatchCharLength: 3, keys: ["stop_name"]}}
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