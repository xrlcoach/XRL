<template>
  <div>
    <TabView>
      <TabPanel header="Scoring">
        <section class="rules-tab">
          <Panel header="Backs">
            <h4>Positional Try:</h4>
            <ul>
              <li>
                8 Line Breaks, Line Break Assists, Try Assists, Offloads, Tackle Breaks, 40/20s,
                20/40s and 1on1 Steals
              </li>
              <li>17 Runs</li>
            </ul>
            <h4>Involvement Try:</h4>
            <ul>
              <li>35 stats</li>
            </ul>
            <h4>Missing in Action:</h4>
            <ul>
              <li>14 or less stats. No more than 1 try. At least 50 mins.</li>
            </ul>
          </Panel>
          <Panel header="Playmakers">
            <h4>Positional Try:</h4>
            <ul>
              <li>
                8 Line Breaks, Line Break Assists, Try Assists, Offloads, Tackle Breaks, 40/20,
                20/40s and 1on1 Steals
              </li>
              <li>250m Kicking Metres</li>
              <li>40 Tackles</li>
            </ul>
            <h4>Involvement Try:</h4>
            <ul>
              <li>45 stats</li>
            </ul>
            <h4>Missing in Action:</h4>
            <ul>
              <li>19 or less stats. No more than 1 try. At least 50 mins.</li>
            </ul>
          </Panel>
          <Panel header="Forwards">
            <h4>Positional Try:</h4>
            <ul>
              <li>
                8 Line Breaks, Line Break Assists, Try Assists, Offloads, Tackle Breaks, 40/20s,
                20/40s and 1on1 Steals
              </li>
              <li>120m in Run Metres</li>
              <li>40 Tackles</li>
            </ul>
            <h4>Involvement Try:</h4>
            <ul>
              <li>45 stats</li>
            </ul>
            <h4>Missing in Action</h4>
            <ul>
              <li>24 or less stats. No more than 1 try. At least 50 mins.</li>
            </ul>
          </Panel>
          <Panel header="Negative Points (All players)">
            <h4>Concede:</h4>
            <ul>
              <li>5 Missed Tackles</li>
              <li>3 Errors</li>
            </ul>
            <p>Sin Bin (-2 points)</p>
            <p>Send Off (-4 points, additional -1 point for every 10 minutes off the field)</p>
          </Panel>
          <Panel header="Multiple Positional Tries (All players)">
            A player can only score a maximum of 4 points for a positional try, even if they meet
            the criteria for multiple positional tries. Players who do score multiple positional
            tries will negate the effect of any concede they also score. Multiple positional tries
            will not affect the negative points from a sin bin or send off.
          </Panel>
        </section>
      </TabPanel>
      <TabPanel header="Lineups">
        <section class="rules-tab">
          <Panel header="Deadline">
            The deadline for lineups to be submitted/altered will be 15 minutes prior to the
            scheduled kickoff time for the first match of the round. If you do not set a lineup, you
            will use the same lineup you used the week before. If you do not select a lineup prior
            to Round 1, you will not field a team.
          </Panel>
          <Panel header="Captaincy">
            Each player is limited to 6 captaincies throughout the regular season. When a player
            reaches this limit the player won't be able to captain the team again until the finals.
          </Panel>
          <Panel header="Powerplays">
            A Powerplay allows the home team to use two captains in a match. No vice-captain can be
            named during a powerplay so if a named captain does not play there is no back up to
            replace them. Each team gets 3 powerplays to use throughout the regular season.
            Powerplays can only be used at home games and can be activated (or deactivated) at any
            point up until lockout. Using all powerplays is not mandatory and will never trigger
            automatically. Powerplays can be included in trades.
          </Panel>
          <Panel header="Vice Goalkickers">
            Vice goalkicker goals will only be counted if the nominated goalkicker does not make the
            final 17 of their NRL team, or if they play no minutes of the match.
          </Panel>
          <Panel header="Substitutions">
            If you name a blank spot in your lineup no bench player will substitute in to this
            position, even if you have a bench player of the same position who plays in a game.
          </Panel>
        </section>
      </TabPanel>
      <TabPanel header="Squads">
        <section class="rules-tab">
          <Panel header="Squad Limit"> The maximum squad size is 19 players. </Panel>
          <Panel header="Trade Deadline">
            Trades can no longer be made once as of 15 minutes prior to the scheduled kickoff of the
            first match in the final round of the XRL regular season.
          </Panel>
          <Panel header="Dual Positions">
            All players initially have one set position, but can gain extra positions by playing in
            those positions in NRL matches. If a player gets three games in a new position with a
            significant amount of minutes, they will be granted dual position status. Players who
            start an NRL game in a new position will automatically be given a dual position credit,
            whereas players who change position mid-game will need to notify the commissioner that
            they have earned a dual position credit.
            <p>Note: Dual Positions does not mean a player is limited to two positions.</p>
          </Panel>
        </section>
      </TabPanel>
      <TabPanel header="Waivers/Scooping">
        <section class="rules-tab">
          <Panel header="Waivers">
            <ul>
              <li>
                There will be two waiver periods each week, at midday Tuesday and then at midday
                Wednesday.
              </li>
              <li>During the Tuesday waiver period a maximum of one player can be waivered</li>
              <li>During the Wednesday waiver period multiple players can be waivered</li>
              <li>
                Players can be added to your waiver list by clicking on the selected player's name
                on the Stats page. This will open up a pop up with an option to ‘Add to Waivers’.
                Waiver list priority order can be changed on the Transfer Centre page, and each
                waiver target can have distinct priority options of which players you will cut to
                accommodate them.
              </li>
            </ul>
          </Panel>
          <Panel header="Scooping">
            <ul>
              <li>
                At 9AM Thursday morning free scooping opens and will cease 15 mins before the
                scheduled kick off of the first game of the round.
              </li>
              <li>Teams are able to scoop as many players as they like each week.</li>
              <li>
                At 9AM Thursday morning, the ‘Add to Waivers’ option will change to ‘Scoop’ (unless
                the player is yet to clear waivers). This will immediately bring that player in to
                your squad (assuming you have an empty roster spot to accommodate them).
              </li>
            </ul>
          </Panel>
          <Panel header="Waiver Order">
            <ul>
              <li>Initial waiver order is determined during the draft.</li>
              <li>
                All teams that waiver on Tuesday will be moved to the bottom of the waiver order for
                Wednesday, in the reverse order of their previous waiver priority.
              </li>
              <li>
                At the end of the round waiver order will be re-ordered such that no team is higher
                in the waiver order than a team that transferred in less players than them. In the
                situation where two or more teams have both transferred in the same number of
                multiple players, teams will be ordered from earliest most recent transfer to latest
                most recent transfer.
              </li>
            </ul>
          </Panel>
          <Panel header="Dropped Players">
            Any player cut from an XRL team’s squad will be ineligible for scooping until after
            clearing Waivers.
          </Panel>
        </section>
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';

  export default defineComponent({
    setup() {
      return {};
    },
    components: {
      TabView,
      TabPanel,
    },
  });
</script>

<style scoped lang="scss">
  .rules-tab {
    text-align: left;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    line-height: 1.5;
  }
  h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    &:not(:first-child) {
      margin-top: 0.5rem;
    }
  }
  ul {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  p {
    margin: 0.5rem 0;
  }

  @media screen and (max-width: 600px) {
    .rules-tab {
      padding: 0;
      margin: -1rem;
    }
  }
</style>
