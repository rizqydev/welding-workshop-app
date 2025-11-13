"use client"
import { useFetch } from "@/hooks/useFetch"
import { BigdataCloudReverseGeo } from "@/lib/definitions"
import React, { useState, useEffect } from "react"

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

  useEffect(() => {
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

    fetchAddress()
  }, [latitude, longitude]) // Re-run when latitude or longitude changes

  return (
    <div>
      <h2>Reverse Geocoding Example</h2>
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
