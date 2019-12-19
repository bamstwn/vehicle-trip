<template>
  <div class="container">
    <div class="d-flex justify-content-center align-items-center loading" v-if="loading">
      <img class="img-fluid" src="https://thumbs.gfycat.com/LameDifferentBalloonfish-small.gif" alt="">
    </div>
    <div class="row" v-else>
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <table class="table responsive-table">
              <thead>
                <tr>
                  <th>Start Datetime</th>
                  <th>End Datetime</th>
                  <th class="pl-lg-4">Locations</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(trip, idtrip) in dataTrip" :key="idtrip">
                  <td data-label="Start Datetime" class="white-space-pre">{{ startDatetime(idtrip) }}</td>
                  <td data-label="End Datetime" class="white-space-pre">{{ endDatetime(idtrip) }}</td>
                  <td data-label="Locations">
                    <ul class="timeline">
                      <li>{{ address.start[idtrip] }}</li>
                      <li>{{ address.end[idtrip] }}</li>
                    </ul>
                  </td>
                  <td><button class="btn btn-primary" @click="exportCSV(idtrip)">Export CSV</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import json from '@/assets/data/vehicle-trip-20190223.json'

export default {
  name: 'TripTable',
  data() {
    return{
      dataTrip: json.trips,
      address: {
        start: [],
        end: []
      },
      loading: false
    }
  },
  computed: {
    startDatetime() {
      return idtrip => `${moment(this.dataTrip[idtrip].start.tracked_at).tz('Asia/Kuala_Lumpur').format("Do MMMM, YYYY[\n]h:mma")}`
    },
    endDatetime() {
      return idtrip => `${moment(this.dataTrip[idtrip].end.tracked_at).tz('Asia/Kuala_Lumpur').format("Do MMMM, YYYY[\n]h:mma")}`
    }
  },
  mounted() {
    this.loading = true
    this.storeTripStats()
    this.addressLookup()
  },
  methods: {
    storeTripStats() {
      let waypointsVal = "";
      let waypointsBefore = "";
      for (var i = 0; i < this.dataTrip.length-1; i++) {
        let point = this.dataTrip[i].end.latitude+','+this.dataTrip[i].end.longitude
        if (point !== waypointsBefore) {
          waypointsBefore = point
          if (i !== 0) {
            waypointsVal += '|'
          }
          waypointsVal += point
        }
      }
      let tripDirection = {
        origin: this.dataTrip[0].start.latitude+','+this.dataTrip[0].start.longitude,
        destination: this.dataTrip[this.dataTrip.length-1].end.latitude+','+this.dataTrip[this.dataTrip.length-1].end.longitude,
        waypoints: waypointsVal
      };
      let tripDirectionSrc = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyARNFl6ns__p2OEy3uCrZMGem8KW8pXwAI&origin='+tripDirection.origin+'&destination='+tripDirection.destination+'&waypoints='+tripDirection.waypoints+'&avoid=tolls|highways'

      this.$store.commit('changeStoreTrip', {key: 'tripDirection', val: tripDirectionSrc})
      let startDuration = moment(json.duration.from).tz('Asia/Kuala_Lumpur').format("Do MMMM, YYYY[\n]HH:mm")
      let endDuration = moment(json.duration.to).tz('Asia/Kuala_Lumpur').format("Do MMMM, YYYY[\n]HH:mm")
      this.$store.commit('changeStoreTrip', {key: 'startDuration', val: startDuration})
      this.$store.commit('changeStoreTrip', {key: 'endDuration', val: endDuration})
      this.$store.commit('changeStoreTrip', {key: 'totalDistance', val: json.summary.distance})
      this.$store.commit('changeStoreTrip', {key: 'totalTrips', val: json.trips.length})
    },
    async addressLookup() {
      for (var i = 0; i < this.dataTrip.length; i++) {
        let startLatitude = this.dataTrip[i].start.latitude
        let startLongitude = this.dataTrip[i].start.longitude
        let urlStart = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&lon="+startLongitude+"&lat="+startLatitude
        await fetch(urlStart)
          .then(resp => resp.json())
          .then(json => (this.address.start.push(json.display_name) ))

        let endLatitude = this.dataTrip[i].end.latitude
        let endLongitude = this.dataTrip[i].end.longitude
        let urlEnd = "https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&lon="+endLongitude+"&lat="+endLatitude
        await fetch(urlEnd)
          .then(resp => resp.json())
          .then(json => (this.address.end.push(json.display_name) ))
      }
      this.loading = false
    },
    exportCSV(idtrip) {
      let startDate = moment(this.dataTrip[idtrip].start.tracked_at).tz('Asia/Kuala_Lumpur').format("YYYY-MM-DD HH:mm:ss")
      let endDate = moment(this.dataTrip[idtrip].end.tracked_at).tz('Asia/Kuala_Lumpur').format("YYYY-MM-DD HH:mm:ss")
      let tripHistories = [{
        "Id": this.dataTrip[idtrip].start.id,
        "Datetime": startDate,
        "Latitude": this.dataTrip[idtrip].start.latitude,
        "Longitude": this.dataTrip[idtrip].start.longitude,
        "Speed (kmh)": 0,
        "Distance (m)": 0,
      }];

      for (var i = 0; i < this.dataTrip[idtrip].histories.length; i++) {
        let history = {
          "Id": this.dataTrip[idtrip].histories[i].id,
          "Datetime": moment(this.dataTrip[idtrip].histories[i].tracked_at).tz('Asia/Kuala_Lumpur').format("YYYY-MM-DD HH:mm:ss"),
          "Latitude": this.dataTrip[idtrip].histories[i].latitude,
          "Longitude": this.dataTrip[idtrip].histories[i].longitude,
          "Speed (kmh)": parseInt(this.dataTrip[idtrip].histories[i].speed * 1.852, 10),
          "Distance (m)": this.dataTrip[idtrip].histories[i].distance,
        };
        tripHistories.push(history)
      }

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(tripHistories[0]).join(";"),
        ...tripHistories.map(item => Object.values(item).join(";"))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "TripData-"+startDate.replace(/:/g, ".").slice(0, -3)+"-"+endDate.replace(/:/g, ".").slice(0, -3)+".csv");
      link.click();
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/main.scss'
</style>
