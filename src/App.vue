<template>
  <div id="app">
    <iframe class="map" :src="tripDirection"></iframe>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card trip-stats">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h2 class="mb-0">Trip Duration</h2>
                  <ul class="timeline">
                    <li>{{ startDuration }}</li>
                    <li>{{ endDuration }}</li>
                  </ul>
                </div>
                <div class="col-md-6 text-right d-flex justify-content-between justify-content-sm-end align-items-center">
                  <div>
                    <span class="trip-total">
                      {{ totalDistance }}
                    </span>
                    <br>
                    <h6 class="mt-2">Total Distance (KM)</h6>
                  </div>
                  <div class="ml-md-3 ml-lg-5">
                    <span class="trip-total">
                      {{ totalTrips }}
                    </span>
                    <br>
                    <h6 class="mt-2">Total Trips</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TripTable />
  </div>
</template>

<script>
import TripTable from './components/TripTable.vue'

export default {
  name: 'app',
  components: {
    TripTable
  },
  computed: {
    tripDirection() {
      return this.$store.state.trips.tripDirection
    },
    startDuration() {
      return this.$store.state.trips.startDuration
    },
    endDuration() {
      return this.$store.state.trips.endDuration
    },
    totalDistance() {
      return this.$store.state.trips.totalDistance.toLocaleString('id-ID')
    },
    totalTrips() {
      return this.$store.state.trips.totalTrips.toLocaleString('id-ID')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/main.scss'
</style>