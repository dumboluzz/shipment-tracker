import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10"
      // interactive: false
    })

    this.#addMarkersToMap()
    this.#fitMapToMarkers()

    this.markers_array = this.markersValue.map((marker) => {
      console.log(marker)
      return [marker.lng, marker.lat]
    })

    this.map.on('load', () => {
      console.log(this.markers_array)
      this.map.addSource('route', {
      'type': 'geojson',
      'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
      'type': 'LineString',
      'coordinates': this.markers_array,
      }
      }
      });
      this.map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {
      'line-join': 'round',
      'line-cap': 'round'
      },
      'paint': {
      'line-color': '#9198a3',
      'line-width': 1
      }
      });
      });
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      // const popup = new mapboxgl.Popup().setHTML(marker.info_window)

      // Create a HTML element for your custom marker
      const customMarker = document.createElement("a")
      customMarker.className = "marker"
      customMarker.style.backgroundImage = `url('${marker.image_url}')`
      customMarker.style.backgroundSize = "fill"
      customMarker.style.backgroundRepeat = "no-repeat"
      customMarker.style.width = "32.5px"
      customMarker.style.height = "40px"
      customMarker.style.paddingBottom = "61px"
      customMarker.style.marginLeft = "3px"
      // customMarker.sty

      // Pass the element as an argument to the new marker
      new mapboxgl.Marker(customMarker)
        .setLngLat([marker.lng, marker.lat])
        // .setPopup(popup)
        .addTo(this.map)
    })
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
