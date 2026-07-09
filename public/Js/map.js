//public/js/map.js

        const map = L.map('map').setView([coordinates[1],coordinates[0]],13); //Latitude,longitude,zoom
        
        //openStreetMap title layer (yeh free hai)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution:'&copy; OpenStreet contributors'
            }
        ).addTo(map);
        //marker add karein
        L.marker([coordinates[1],coordinates[0]]).addTo(map)
        .bindPopup(`<h3>${listing.title}</h3><p>Location: ${listing.location}</p><p>Exact location will be provided after booking</p>`)
        .openPopup();
    

    