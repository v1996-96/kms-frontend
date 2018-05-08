<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-text-field v-model="name" label="Project name" required></v-text-field>
        <v-text-field v-model="description" label="Description" multi-line rows="3"></v-text-field>
        <v-text-field v-model="goal" label="Main goal"></v-text-field>

        <!-- Dates -->
        <v-container fluid grid-list-lg class="pa-0">
          <v-layout row wrap>
            <v-flex lg6>
              <v-menu
                ref="startDateMenu"
                lazy
                :close-on-content-click="false"
                v-model="startDateMenu"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                :return-value.sync="startDate">
                <v-text-field
                  slot="activator"
                  label="Start date"
                  v-model="startDate"
                  @input="$v.startDate.$touch()"
                  @blur="$v.startDate.$touch()"
                  :error-messages="startDateErrors"
                  clearable
                  readonly></v-text-field>
                <v-date-picker v-model="startDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex lg6>
              <v-menu
                ref="endDateMenu"
                lazy
                :close-on-content-click="false"
                v-model="endDateMenu"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                :return-value.sync="endDate">
                <v-text-field
                  slot="activator"
                  label="Finish date"
                  v-model="endDate"
                  @input="$v.endDate.$touch()"
                  @blur="$v.endDate.$touch()"
                  :error-messages="endDateErrors"
                  clearable
                  readonly></v-text-field>
                <v-date-picker v-model="endDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.endDateMenu.save(endDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>

        <v-text-field v-model="avatar" label="A place for project avatar"></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn depressed :to="{ name: 'Projects' }">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" depressed :disabled="$v.$error" @click="create">Create project</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'kms-project-settings-info-tab'
}
</script>
