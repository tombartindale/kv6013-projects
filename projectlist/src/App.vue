<template lang="pug">
q-layout(view="lHh Lpr lff")
  q-page-container
    q-page
      .row.bg-black.text-white.q-px-md.items-center
        .col-12.col-sm-6
          .text-h3.text-bold.q-py-sm KV6013 PROJECT PORTAL.
        .col.text-right
          img(contain, src="/NU_Logo_White.svg", style="max-height: 120px")
      .q-pa-lg
        .row.justify-center
          .col-md-8.text-center.q-my-lg
            .text-body1 Browse this page to find projects that interest you. It is best to contact the supervisors of projects you are interested in to understand them better and help secure your involvement.
        .row.justify-center
          .col-auto
            .text-body2.text-overline.text-uppercase Filter
        .row.justify-center
          .col-auto
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
          .col-12.text-center
            q-chip(
              v-for="(v,tag) of filter.Supervisor",
              v-show="v",
              clickable,
              size="md",
              :selected.sync="filter.Supervisor[tag]"
            )
              span {{ tag }}
            //- div {{ filter }}
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
                    .text-body1.q-mb-md {{ project["Short_x0020_description_x0020_of"] }}

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
                    .text-small.absolute-bottom-right.q-pa-xs.q-pr-sm.text-grey(
                      style="font-size: 12px"
                    ) added {{ project.Modified }}
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
                            q-img(:src="project.Supervisor.Picture") 
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

export default {
  name: "App",
  data: function () {
    return {
      projects,
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
  },
  computed: {
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
          _.intersection(ts, tsf).length > 0 ||
          _.intersection(ps, psf).length > 0 ||
          _.intersection(ms, msf).length > 0 ||
          _.intersection(ss, ssf).length > 0
        );
      });
    },
  },
};
</script>


