<template lang="pug">
q-layout(view="lHh Lpr lff")
  q-page-container
    q-page
      .row.bg-black.text-white.q-px-md.items-center
        .col-12.col-sm-6
          .text-h3.text-bold.q-py-sm KV6013 PROJECT PORTAL.
        .col.text-right
          img(
            contain,
            src="~./assets/NU_Logo_White.svg",
            style="max-height: 120px"
          )
      .q-pa-lg
        .row
        .row.justify-center
          .col-md-8.text-center.q-mt-lg
            .text-h5 Browse this page to find projects (or supervisors) that interest you. It is best to contact the supervisors of projects you are interested in to understand them better and help secure your involvement.
          .col-md-8.text-center.q-mb-lg.text-primary.q-mt-md
            .text-h5 You have {{ daysLeft }} days until you need to submit your preferences
            q-btn.q-mt-md(
              square,
              unelevated,
              color="black",
              target="_BLANK",
              href="https://livenorthumbriaac-my.sharepoint.com/:l:/g/personal/tom_bartindale_northumbria_ac_uk/FEgYMTZjAbJGnjX3MPvfU_cBSUUFy-K7SqsmRu8WOSe9zQ?nav=NzRiNWU3ZGItM2E2MS00NGU2LTk4YzYtZjRmYTQxMjQ1NTVl"
            ) Submit Preferences
        .row.justify-center
          .col-auto
            .text-body2.text-overline.text-uppercase Filter
        .row.justify-center
          .col-auto
            //- div {{ selectedSupervisor }}

            q-chip(
              v-for="(v,tag) of filter.TechnicalSkillsRequired",
              clickable,
              :selected.sync="filter.TechnicalSkillsRequired[tag]"
            ) {{ tag }}
            q-chip(
              v-for="(v,tag) of filter.ProjectMethods",
              clickable,
              :selected.sync="filter.ProjectMethods[tag]"
            ) {{ tag }}
            q-chip(
              v-for="(v,tag) of filter.PotentialOutput",
              clickable,
              :selected.sync="filter.PotentialOutput[tag]"
            ) {{ tag }}
          //- .col-12.text-center
          //-   q-chip(
          //-     v-for="(v,tag) of filter.Supervisor",
          //-     v-show="v",
          //-     clickable,
          //-     size="md",
          //-     :selected.sync="filter.Supervisor[tag]"
          //-   )
          //-     span {{ tag }}
        .row.justify-center
          .col-3
            q-select(
              label="By supervisor",
              rounded,
              outlined,
              dense,
              clearable,
              :options="Object.keys(filter.Supervisor)",
              v-model="selectedSupervisor",
              @input="updateSupervisor"
            )
            //- div {{ filter }}
        .text-h6.q-ma-xl.text-center(v-if="approved.length === 0") There are no projects listed yet...
        .row.q-col-gutter-lg.q-mt-xl.justify-center
          .col-12.col-sm-6.col-md-4(v-for="project of filtered")
            q-card.full-height(flat, bordered, square)
              .column.full-height
                .col-auto
                  q-card-section
                    .text-h6.text-uppercase.text-bold {{ project.Title }}
                q-separator
                .col-auto
                  q-card-section
                    .row.items-center.q-col-gutter-md
                      .col-auto
                        q-avatar.bg-green.text-white {{ project.ID }}
                      .col
                        .text-body2 To apply to work on this project, use this ID on your preference form.
                q-separator
                .col
                  q-card-section
                    //- div {{ project.expand }}
                    .cursor-pointer(
                      style="position: relative",
                      @click="expand(project)"
                    )
                      div(
                        style="height: 150px; min-height: 150px; overflow: hidden; transition: height 1s ease-out",
                        :class="{ expanded: project.expand }"
                      )
                        .text-body1.q-mb-md.text-justify {{ project["Short_x0020_description_x0020_of"] }}
                      .absolute-bottom(
                        v-show="!project.expand",
                        style="height: 100%; width: 100%; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 1) 100%)"
                      )
                    //- q-btn(size="sm", dense, flat, no-caps) read more

                    //- div {{ project }}
                    .row
                      .text-overline Tags
                    .row
                      q-chip(
                        v-for="tag of project.TechnicalSkillsRequired",
                        clickable,
                        :selected.sync="filter.TechnicalSkillsRequired[tag.Value]"
                      ) {{ tag.Value }}
                      q-chip(
                        v-for="tag of project.ProjectMethods",
                        clickable,
                        :selected.sync="filter.ProjectMethods[tag.Value]"
                      ) {{ tag.Value }}
                      q-chip(
                        v-for="tag of project.PotentialOutput",
                        clickable,
                        :selected.sync="filter.PotentialOutput[tag.Value]"
                      ) {{ tag.Value }}
                      //- div {{ project }}
                    .q-my-md
                  //- .text-small.absolute-bottom-right.q-pa-xs.q-pr-sm.text-grey(
                  //-   style="font-size: 12px"
                  //- ) added {{ project.Modified }}
                q-separator
                .col-auto
                  q-card-section
                    .row.justify-between.items-center
                      .col
                        q-chip(
                          clickable,
                          size="md",
                          :selected.sync="filter.Supervisor[project.Supervisor.DisplayName]"
                        )
                          q-avatar
                            q-icon(name="person") 
                          span {{ project.Supervisor.DisplayName }}
                      .col-auto
                        //- div {{ project.Supervisor }}
                        q-btn(
                          square,
                          unelevated,
                          color="black",
                          target="_BLANK",
                          :href="`https://researchportal.northumbria.ac.uk/en/persons/?search=${project.Supervisor.Email}`"
                        ) View Profile
</template>

<script>
const projects = require("../data/projects.json");
const _ = require("lodash");
const { DateTime } = require("luxon");

export default {
  name: "App",
  data: function () {
    return {
      projects,
      selectedSupervisor: "",
      isExpanded: {},
      filter: {
        TechnicalSkillsRequired: {},
        Supervisor: {},
        ProjectMethods: {},
        PotentialOutput: {},
      },
    };
  },
  mounted() {
    //calc all filters:

    this.filter.TechnicalSkillsRequired = _.zipObject(
      _.uniq(
        _.flatten(
          _.map(this.projects, (pro) => {
            return _.map(pro.TechnicalSkillsRequired, "Value");
          })
        )
      ),
      false
    );
    this.filter.PotentialOutput = _.zipObject(
      _.uniq(
        _.flatten(
          _.map(this.projects, (pro) => {
            return _.map(pro.PotentialOutput, "Value");
          })
        )
      ),
      false
    );
    this.filter.ProjectMethods = _.zipObject(
      _.uniq(
        _.flatten(
          _.map(this.projects, (pro) => {
            return _.map(pro.ProjectMethods, "Value");
          })
        )
      ),
      false
    );

    const supers = _.compact(
      _.uniq(_.map(this.projects, "Supervisor.DisplayName"))
    );

    this.filter.Supervisor = _.zipObject(
      supers,
      Array(supers.length).fill(false)
    );
  },
  watch: {
    "filter.Supervisor": {
      deep: true,
      handler() {
        // console.log("handler");
        for (let s in this.filter.Supervisor) {
          if (this.filter.Supervisor[s] === true) this.selectedSupervisor = s;
        }
      },
    },
  },
  methods: {
    expand(project) {
      if (project.expand) project.expand = false;
      else this.$set(project, "expand", true);
      // console.log(project);
      // project.expand = true;
    },
    updateSupervisor(val) {
      //set all to false:
      for (let s in this.filter.Supervisor) {
        this.filter.Supervisor[s] = false;
      }

      if (val != null) {
        this.filter.Supervisor[val] = true;
      }

      // console.log(this.filter.Supervisor);
    },
  },
  computed: {
    daysLeft() {
      return Math.round(
        DateTime.fromFormat("14.10.2024", "dd.MM.yyyy").diffNow("days").days
      );
    },
    approved() {
      return _.filter(this.projects, { Approved: true });
    },
    filtered() {
      let tsf = [];
      for (const t in this.filter.TechnicalSkillsRequired) {
        if (this.filter.TechnicalSkillsRequired[t]) tsf.push(t);
      }

      let msf = [];
      for (const t in this.filter.ProjectMethods) {
        if (this.filter.ProjectMethods[t]) msf.push(t);
      }

      let psf = [];
      for (const t in this.filter.PotentialOutput) {
        if (this.filter.PotentialOutput[t]) psf.push(t);
      }

      let ssf = [];
      for (const t in this.filter.Supervisor) {
        if (this.filter.Supervisor[t]) ssf.push(t);
      }

      if (
        tsf.length === 0 &&
        msf.length === 0 &&
        psf.length === 0 &&
        ssf.length === 0
      )
        return this.approved;

      return _.filter(this.approved, (p) => {
        const ts = _.map(p.TechnicalSkillsRequired, "Value");
        const ms = _.map(p.ProjectMethods, "Value");
        const ps = _.map(p.PotentialOutput, "Value");
        const ss = [p.Supervisor.DisplayName];

        return (
          (tsf.length === 0 || _.intersection(ts, tsf).length > 0) &&
          (psf.length === 0 || _.intersection(ps, psf).length > 0) &&
          (msf.length === 0 || _.intersection(ms, msf).length > 0) &&
          (ssf.length === 0 || _.intersection(ss, ssf).length > 0)
        );
      });
    },
  },
};
</script>


<style scoped>
.expanded {
  height: inherit !important;
}
</style>