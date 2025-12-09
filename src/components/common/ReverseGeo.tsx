"use client"
import { useFetch } from "@/hooks/useFetch"
import { BigdataCloudReverseGeo } from "@/lib/definitions"
import { Button } from "@headlessui/react"
import { useState, useEffect } from "react"

export default function ReverseGeocode() {
  const { fetchApi } = useFetch()
  const [address, setAddress] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  useEffect(() => {
    // Example: Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
      })
    }
  }, [])

  const fetchAddress = async () => {
    if (latitude && longitude) {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`

      try {
        const data = await fetchApi<BigdataCloudReverseGeo>(url)

        setAddress(data.locality + ", " + data.city)
      } catch (error) {
        console.error("Error fetching address:", error)
        setAddress("Error retrieving address")
      }
    }
  }

  return (
    <div>
      <Button
        disabled={address !== ""}
        onClick={() => fetchAddress()}
        className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"
      >
        Dapatkan Lokasi
      </Button>
      {latitude && longitude ? (
        <p>
          Coordinates: {latitude}, {longitude}
        </p>
      ) : (
        <p>Getting location...</p>
      )}
      {address && <p>Address: {address}</p>}
    </div>
  )
}
