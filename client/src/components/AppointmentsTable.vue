<template>
  <div class='appointments-table'>
    <vue-good-table
      mode='remote'
      @on-page-change='onPageChange'
      @on-per-page-change='onPerPageChange'
      :totalRows='totalRecords'
      :pagination-options='{
        enabled: true,
        page, perPage
      }'
      :search-options='{
        enabled: false
      }'
      :sort-options='{
        enabled: false
      }'
      :rows='rows'
      :columns='columns'
      :isLoading='loading'
    />
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';

export default {
  components: { VueGoodTable },
  data () {
    return {
      columns: [
        {
          label: 'Clinic',
          field: 'clinic',
        },
        {
          label: 'Name',
          field: 'name'
        },
        {
          label: 'Email',
          field: 'email'
        },
        {
          label: 'Phone number',
          field: 'phone'
        },
        {
          label: 'Sent at',
          field: 'date'
        }
      ],
      loading: false,
      rows: [],
      totalRecords: 0,
      serverParams: {
        columnFilters: {
        },
        sort: {
          field: '', 
          type: '',
        },
        page: 1, 
        perPage: 10
      }
    }; 
  },
  methods: {
    async loadItems () {
      this.loading = true;
      try {
        const response = await fetch(
          `/api/appointments?page=${this.serverParams.page - 1}&perPage=${this.serverParams.perPage}`
        );
        const jsonResponse = await response.json();
        this.rows = jsonResponse.data.appointments.map(appointment => ({
          ...appointment,
          clinic: appointment.clinic.name,
          date: new Date(appointment.date * 1000).toLocaleString()
        }));
        this.totalRecords = jsonResponse.data.total;
      } catch (error) {
        console.error('failed to load', error);
      } finally {
        this.loading = false;
      }
    },

    onPageChange (params) {
      this.updateParams({ page: params.currentPage });
      this.loadItems();
    },

    onPerPageChange (params) {
      this.updateParams({ perPage: params.currentPerPage });
      this.loadItems();
    },

    updateParams (newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    }
  }
}
</script>

<style scoped>

</style>
