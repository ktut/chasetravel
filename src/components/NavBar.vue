<script lang="ts">
import PointsPopover from './PointsPopover.vue'
import { useSearchStore } from '@/stores/searchStore'

export default {
  name: 'NavBar',
  components: {
    PointsPopover
  },
  data() {
    return {
      isLoading: false,
      isSigningOut: false,
      isPopoverVisible: false
    }
  },
  computed: {
    searchStore() {
      return useSearchStore()
    },
    isSignedIn(): boolean {
      return this.searchStore.isSignedIn
    },
    points(): number {
      return this.searchStore.pointsBalance
    },
    formattedPoints(): string {
      return this.points.toLocaleString('en-US')
    },
    cardLastFour(): string {
      return String(this.points).slice(-4)
    }
  },
  methods: {
    handleSignIn() {
      if (this.isSignedIn || this.isLoading) return

      this.isLoading = true

      setTimeout(() => {
        this.isLoading = false
        this.searchStore.signIn()
      }, 2000)
    },
    handleSignOut() {
      if (this.isSigningOut) return

      this.isSigningOut = true

      setTimeout(() => {
        this.isSigningOut = false
        this.searchStore.signOut()
      }, 2000)
    },
    showPopover() {
      this.isPopoverVisible = true
    },
    hidePopover() {
      this.isPopoverVisible = false
    },
    closePopover() {
      this.isPopoverVisible = false
    }
  }
}
</script>

<template>
  <nav class="navbar glass-effect">
    <div class="navbar__container">
      <!-- Logo Section -->
      <div class="navbar__logo">
        <RouterLink to="/" ><img src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MjAgMTkwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzMxMzczZDt9LmNscy0ye2ZpbGw6IzAwNWViODt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjc5LjgyLDczLjIxQTYuMTksNi4xOSwwLDAsMCwyNzUuNzcsNzJxLTQuMzksMC04LjMyLDQuNTdhMjkuNTIsMjkuNTIsMCwwLDAtNS4yOSw5LjkyTDI2MS41OCw3MmwtMTUuODYsMi4ydjEuMWE3LjM2LDcuMzYsMCwwLDEsMy41NSwzLjM1LDE2LjYzLDE2LjYzLDAsMCwxLDEsNi41OXY0NC41YTEwLjMsMTAuMywwLDAsMS0xLDUuMTYsNS4xNiw1LjE2LDAsMCwxLTEuNTEsMS40Nyw1LjMzLDUuMzMsMCwwLDEtMiwuNzN2MS4xNmgyMy44NnYtMS4xNnEtNC4yNS0xLTUuNzktMy4xNmMtMS0xLjQxLTEuNTUtMy42Ni0xLjU1LTYuNzdWODkuNjVhMjksMjksMCwwLDEsNC4yNi03LjM0LDYuMDUsNi4wNSwwLDAsMSw0LjUzLTIsNy40Nyw3LjQ3LDAsMCwxLDIuNzIuNTIsOC4xNSw4LjE1LDAsMCwwLDMsLjUxLDQuNjEsNC42MSwwLDAsMCwyLjU4LS44Niw0LjY0LDQuNjQsMCwwLDAsMS43OS00Ljg4LDQuNiw0LjYsMCwwLDAtMS40LTIuMzNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzcyLjYxLDcyLjA4djEuMTdxNy4wOSwyLjYxLDcuMDksOC45MmExOS43MywxOS43MywwLDAsMS0uMzksMy42QTU0LjM3LDU0LjM3LDAsMCwxLDM3OCw5MS4xMnEtMSwzLjIxLTIuNjUsNy43OGwtOC44MywyMy40MkwzNTMuMzgsODljLTEuMjktMy4zLTIuMTItNS42NC0yLjUyLTYuOTNhMTQuNDQsMTQuNDQsMCwwLDEtLjU4LTQsNC43Miw0LjcyLDAsMCwxLDMuNDgtNC43VjcyLjE5SDMzMC4yOHYxLjE3YzEuNzIuNzgsMy40NSwyLjY4LDUuMjMsNS42N2ExMzgsMTM4LDAsMCwxLDcsMTUuMWwxOC4wNyw0NC4yN2gyLjMybDE2LjUxLTM5Ljg0cTMuMDktNy4zMiw1LjIzLTEyYzEuNDItMy4wOCwyLjY0LTUuNTMsMy42Ny03LjNhMTYuMjcsMTYuMjcsMCwwLDEsMy00LDEwLjQ4LDEwLjQ4LDAsMCwxLDMuMy0yVjcyLjE4WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQzOS43LDEyMy40N3EtNS40Miw1Ljk0LTE0LjMyLDUuOTRhMjEuNDYsMjEuNDYsMCwwLDEtMTIuODktNC4xMiwyNy41MSwyNy41MSwwLDAsMS04LjkyLTExLjQzLDQwLjU4LDQwLjU4LDAsMCwxLTMuMjMtMTYuNDV2LS4xMmgzOS44N3YtM3EwLTEwLjQ1LTYuMTktMTYuNzFUNDE3LjYsNzEuMzhhMjMuMiwyMy4yLDAsMCwwLTEzLjgyLDQuMzMsMjksMjksMCwwLDAtOS41MywxMS45LDQxLDQxLDAsMCwwLTMuNDgsMTcuMjgsNDIuNTMsNDIuNTMsMCwwLDAsMy42NywxOC4yNywyOC40MywyOC40MywwLDAsMCwxMC4zMSwxMi4xMiwyNy41OCwyNy41OCwwLDAsMCwxNS40Miw0LjMzQTE4LjcxLDE4LjcxLDAsMCwwLDQzMiwxMzUuNzVxNC45NS0zLjg4LDguMzItMTEuOVptLTM0Ljg0LTQzYTE0LDE0LDAsMCwxLDUuMTktNC43LDE0LjE5LDE0LjE5LDAsMCwxLDYuODItMS42MSwxMS45MSwxMS45MSwwLDAsMSw4Ljc3LDMuMywxMS40NywxMS40NywwLDAsMSwyLjU4LDRBMTEuNjQsMTEuNjQsMCwwLDEsNDI5LDg2LjJjMCwyLjgzLTEsNS0zLDYuMThzLTUuMzQsMi0xMC4wNywyLjJMNDAwLjQ2LDk1QzQwMC44LDg5LjEsNDAyLjIyLDg0LjIxLDQwNC44Niw4MC41WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ0NSwxMzguM3YtMS4xNmE1LjMzLDUuMzMsMCwwLDAsMi0uNzMsNS4xMiw1LjEyLDAsMCwwLDEuNS0xLjQ3LDEwLjIxLDEwLjIxLDAsMCwwLDEtNS4xNlY2NS44N2ExNi4zOCwxNi4zOCwwLDAsMC0xLTYuNTgsNy4xNyw3LjE3LDAsMCwwLTMuNTQtMy4zNVY1NC43N2wxNi41MS0yLjl2NzcuOTFhOS42Myw5LjYzLDAsMCwwLDEuMSw1LjE2LDUuMTUsNS4xNSwwLDAsMCwxLjQ5LDEuNDUsNS4yOSw1LjI5LDAsMCwwLDEuOTMuNzV2MS4xNloiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zNDcuNjUsMTM2LjMyYy0xLjIyLS4xNi0yLjM3LTEtMy40NC0yLjY3YTIyLjgyLDIyLjgyLDAsMCwxLTIuNzItNi44M0wzMzAuNDIsOTEuNTNjLTItNy43Ni01LjA1LTE0LTguOTItMTcuMDhzLTkuMzItNC4yNy0xNi41Mi0zLjcxYTMzLjI3LDMzLjI3LDAsMCwwLTEwLjQ5LDIuMzgsMTguMSwxOC4xLDAsMCwwLTYuODgsNS4xMSw5LDksMCwwLDAtMi4yMSw2LjU2LDQuNjQsNC42NCwwLDAsMCwuMzksMS43Miw0LjUyLDQuNTIsMCwwLDAsMSwxLjQ0LDQuMDksNC4wOSwwLDAsMCwxLjQ4LjgzLDQsNCwwLDAsMCwxLjY5LjE2YzIuNDktLjE5LDMuODItMiw0LTUuMjguMTgtMy4xNSwxLTUuNTMsMi41NS03LjFhMTAuMDYsMTAuMDYsMCwwLDEsNi42NS0yLjY3LDEwLjc2LDEwLjc2LDAsMCwxLDYuMzcsMS4xOSwxMi4yNiwxMi4yNiwwLDAsMSw0LjQzLDUuNDgsNjAuNjgsNjAuNjgsMCwwLDEsMi41OSw2LjYzcS0xNi4wNiw4LjY2LTIzLjQ5LDE2LjdhMjMsMjMsMCwwLDAtNi4zNCwxOSwxNi41NCwxNi41NCwwLDAsMCw3LjUxLDEyLjg5YzQuNDgsMyw5LDQuMjgsMTUuODUsMy42NGEyNS41NCwyNS41NCwwLDAsMCwxMy44OC01LjI5LDI0Ljg1LDI0Ljg1LDAsMCwwLDUuNTMtNi40M2MxLjI3LDMuNzEsMi43Nyw2LjM4LDQuNDgsNy45MywyLDEuNzUsNSwyLjUxLDguNzgsMi4yMmw0LjktLjM4Wm0tMjIuNTUtNy41N2ExNy40MywxNy40MywwLDAsMS04LjkyLDMuNjhjLTQuNy40My05LjMxLS42MS0xMi4zMi0zLjI1cy00Ljc2LTYuNDEtNS4xOS0xMS4yOGMtLjU0LTUuNzMsMS42OC0xMS4xMSw1LjE5LTE2LjA1QTU2LjYyLDU2LjYyLDAsMCwxLDMxNy4yNSw4OWMuMzUsMS4xNS43LDIuMzYsMSwzLjZsMTAuNSwzMi43MUEyNCwyNCwwLDAsMSwzMjUuMSwxMjguNzVaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjA1LjY0LDU1djczLjQ3YzAsMi44NC0uNDgsNC44Ni0xLjQyLDYuMDdzLTIuNjYsMi4wNi01LjE2LDIuNTl2MS4yOWgyNi4wN3YtMS4yOWMtMi41MS0uNTItNC4yMi0xLjM4LTUuMTYtMi41OXMtMS40Mi0zLjIzLTEuNDItNi4wN1Y1NWgxYzkuNjEuMjYsMTkuMjEsNC4zNiwyNC41NCwxMy44N2wxLjU4LS4yNy00LjQ5LTE2LjY5SDE4M2wtNC41LDE2LjcyLDEuNTguMjdjNS4zNC05LjU1LDE0Ljk0LTEzLjY1LDI0LjU0LTEzLjg3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI3OS44Miw3My4yMUE2LjE5LDYuMTksMCwwLDAsMjc1Ljc3LDcycS00LjM5LDAtOC4zMiw0LjU3YTI5LjUyLDI5LjUyLDAsMCwwLTUuMjksOS45MkwyNjEuNTgsNzJsLTE1Ljg2LDIuMnYxLjFhNy4zNiw3LjM2LDAsMCwxLDMuNTUsMy4zNSwxNi42MywxNi42MywwLDAsMSwxLDYuNTl2NDQuNWExMC4zLDEwLjMsMCwwLDEtMSw1LjE2LDUuMTYsNS4xNiwwLDAsMS0xLjUxLDEuNDcsNS4zMyw1LjMzLDAsMCwxLTIsLjczdjEuMTZoMjMuODZ2LTEuMTZxLTQuMjUtMS01Ljc5LTMuMTZjLTEtMS40MS0xLjU1LTMuNjYtMS41NS02Ljc3Vjg5LjY1YTI5LDI5LDAsMCwxLDQuMjYtNy4zNCw2LjA1LDYuMDUsMCwwLDEsNC41My0yLDcuNDcsNy40NywwLDAsMSwyLjcyLjUyLDguMTUsOC4xNSwwLDAsMCwzLC41MSw0LjYxLDQuNjEsMCwwLDAsMi41OC0uODYsNC42NCw0LjY0LDAsMCwwLDEuNzktNC44OCw0LjYsNC42LDAsMCwwLTEuNC0yLjMzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM3Mi42MSw3Mi4wOHYxLjE3cTcuMDksMi42MSw3LjA5LDguOTJhMTkuNzMsMTkuNzMsMCwwLDEtLjM5LDMuNkE1NC4zNyw1NC4zNywwLDAsMSwzNzgsOTEuMTJxLTEsMy4yMS0yLjY1LDcuNzhsLTguODMsMjMuNDJMMzUzLjM4LDg5Yy0xLjI5LTMuMy0yLjEyLTUuNjQtMi41Mi02LjkzYTE0LjQ0LDE0LjQ0LDAsMCwxLS41OC00LDQuNzIsNC43MiwwLDAsMSwzLjQ4LTQuN1Y3Mi4xOUgzMzAuMjh2MS4xN2MxLjcyLjc4LDMuNDUsMi42OCw1LjIzLDUuNjdhMTM4LDEzOCwwLDAsMSw3LDE1LjFsMTguMDcsNDQuMjdoMi4zMmwxNi41MS0zOS44NHEzLjA5LTcuMzIsNS4yMy0xMmMxLjQyLTMuMDgsMi42NC01LjUzLDMuNjctNy4zYTE2LjI3LDE2LjI3LDAsMCwxLDMtNCwxMC40OCwxMC40OCwwLDAsMSwzLjMtMlY3Mi4xOFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00MzkuNywxMjMuNDdxLTUuNDIsNS45NC0xNC4zMiw1Ljk0YTIxLjQ2LDIxLjQ2LDAsMCwxLTEyLjg5LTQuMTIsMjcuNTEsMjcuNTEsMCwwLDEtOC45Mi0xMS40Myw0MC41OCw0MC41OCwwLDAsMS0zLjIzLTE2LjQ1di0uMTJoMzkuODd2LTNxMC0xMC40NS02LjE5LTE2LjcxVDQxNy42LDcxLjM4YTIzLjIsMjMuMiwwLDAsMC0xMy44Miw0LjMzLDI5LDI5LDAsMCwwLTkuNTMsMTEuOSw0MSw0MSwwLDAsMC0zLjQ4LDE3LjI4LDQyLjUzLDQyLjUzLDAsMCwwLDMuNjcsMTguMjcsMjguNDMsMjguNDMsMCwwLDAsMTAuMzEsMTIuMTIsMjcuNTgsMjcuNTgsMCwwLDAsMTUuNDIsNC4zM0ExOC43MSwxOC43MSwwLDAsMCw0MzIsMTM1Ljc1cTQuOTUtMy44OCw4LjMyLTExLjlabS0zNC44NC00M2ExNCwxNCwwLDAsMSw1LjE5LTQuNywxNC4xOSwxNC4xOSwwLDAsMSw2LjgyLTEuNjEsMTEuOTEsMTEuOTEsMCwwLDEsOC43NywzLjMsMTEuNDcsMTEuNDcsMCwwLDEsMi41OCw0QTExLjY0LDExLjY0LDAsMCwxLDQyOSw4Ni4yYzAsMi44My0xLDUtMyw2LjE4cy01LjM0LDItMTAuMDcsMi4yTDQwMC40Niw5NUM0MDAuOCw4OS4xLDQwMi4yMiw4NC4yMSw0MDQuODYsODAuNVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NDUsMTM4LjN2LTEuMTZhNS4zMyw1LjMzLDAsMCwwLDItLjczLDUuMTIsNS4xMiwwLDAsMCwxLjUtMS40NywxMC4yMSwxMC4yMSwwLDAsMCwxLTUuMTZWNjUuODdhMTYuMzgsMTYuMzgsMCwwLDAtMS02LjU4LDcuMTcsNy4xNywwLDAsMC0zLjU0LTMuMzVWNTQuNzdsMTYuNTEtMi45djc3LjkxYTkuNjMsOS42MywwLDAsMCwxLjEsNS4xNiw1LjE1LDUuMTUsMCwwLDAsMS40OSwxLjQ1LDUuMjksNS4yOSwwLDAsMCwxLjkzLjc1djEuMTZaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzQ3LjY1LDEzNi4zMmMtMS4yMi0uMTYtMi4zNy0xLTMuNDQtMi42N2EyMi44MiwyMi44MiwwLDAsMS0yLjcyLTYuODNMMzMwLjQyLDkxLjUzYy0yLTcuNzYtNS4wNS0xNC04LjkyLTE3LjA4cy05LjMyLTQuMjctMTYuNTItMy43MWEzMy4yNywzMy4yNywwLDAsMC0xMC40OSwyLjM4LDE4LjEsMTguMSwwLDAsMC02Ljg4LDUuMTEsOSw5LDAsMCwwLTIuMjEsNi41Niw0LjY0LDQuNjQsMCwwLDAsLjM5LDEuNzIsNC41Miw0LjUyLDAsMCwwLDEsMS40NCw0LjA5LDQuMDksMCwwLDAsMS40OC44Myw0LDQsMCwwLDAsMS42OS4xNmMyLjQ5LS4xOSwzLjgyLTIsNC01LjI4LjE4LTMuMTUsMS01LjUzLDIuNTUtNy4xYTEwLjA2LDEwLjA2LDAsMCwxLDYuNjUtMi42NywxMC43NiwxMC43NiwwLDAsMSw2LjM3LDEuMTksMTIuMjYsMTIuMjYsMCwwLDEsNC40Myw1LjQ4LDYwLjY4LDYwLjY4LDAsMCwxLDIuNTksNi42M3EtMTYuMDYsOC42Ni0yMy40OSwxNi43YTIzLDIzLDAsMCwwLTYuMzQsMTksMTYuNTQsMTYuNTQsMCwwLDAsNy41MSwxMi44OWM0LjQ4LDMsOSw0LjI4LDE1Ljg1LDMuNjRhMjUuNTQsMjUuNTQsMCwwLDAsMTMuODgtNS4yOSwyNC44NSwyNC44NSwwLDAsMCw1LjUzLTYuNDNjMS4yNywzLjcxLDIuNzcsNi4zOCw0LjQ4LDcuOTMsMiwxLjc1LDUsMi41MSw4Ljc4LDIuMjJsNC45LS4zOFptLTIyLjU1LTcuNTdhMTcuNDMsMTcuNDMsMCwwLDEtOC45MiwzLjY4Yy00LjcuNDMtOS4zMS0uNjEtMTIuMzItMy4yNXMtNC43Ni02LjQxLTUuMTktMTEuMjhjLS41NC01LjczLDEuNjgtMTEuMTEsNS4xOS0xNi4wNUE1Ni42Miw1Ni42MiwwLDAsMSwzMTcuMjUsODljLjM1LDEuMTUuNywyLjM2LDEsMy42bDEwLjUsMzIuNzFBMjQsMjQsMCwwLDEsMzI1LjEsMTI4Ljc1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIwNS42NCw1NXY3My40N2MwLDIuODQtLjQ4LDQuODYtMS40Miw2LjA3cy0yLjY2LDIuMDYtNS4xNiwyLjU5djEuMjloMjYuMDd2LTEuMjljLTIuNTEtLjUyLTQuMjItMS4zOC01LjE2LTIuNTlzLTEuNDItMy4yMy0xLjQyLTYuMDdWNTVoMWM5LjYxLjI2LDE5LjIxLDQuMzYsMjQuNTQsMTMuODdsMS41OC0uMjctNC40OS0xNi42OUgxODNsLTQuNSwxNi43MiwxLjU4LjI3YzUuMzQtOS41NSwxNC45NC0xMy42NSwyNC41NC0xMy44N1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik03Ni4yNiwzNy4zNGE0LjA4LDQuMDgsMCwwLDAtMi44OCwxLjE5LDMuODIsMy44MiwwLDAsMC0uODgsMS4zMiw0LDQsMCwwLDAtLjMxLDEuNTZWNjkuOTRoNzUuMzhMMTEzLjMsMzcuMzRaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTUwLjMyLDc4LjU3YTQuMDYsNC4wNiwwLDAsMC00LjA2LTQuMDdIMTE3Ljcydjc1LjMzbDMyLjYtMzQuMzJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTA5LjA4LDE1Mi42NmE0LDQsMCwwLDAsMi44Ny0xLjE5LDQsNCwwLDAsMCwuODgtMS4zMiw0LjEzLDQuMTMsMCwwLDAsLjMxLTEuNTZWMTIwSDM3LjgxTDcyLjEyLDE1Mi42WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTM1LDExMS4zOWE0LDQsMCwwLDAsLjMxLDEuNTYsNCw0LDAsMCwwLC44OCwxLjMyLDQuMDgsNC4wOCwwLDAsMCwyLjg3LDEuMTlINjcuNlY0MC4wN0wzNSw3NC40MVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NzIuODUsNTkuNjhhMy4xMywzLjEzLDAsMCwxLTIuMDktLjYyLDIuMiwyLjIsMCwwLDEtLjU4LS44LDIuMTcsMi4xNywwLDAsMS0uMTctMWgxYTEuMjcsMS4yNywwLDAsMCwuMTEuNTQsMS4yMiwxLjIyLDAsMCwwLC4zMy40NSwyLjIxLDIuMjEsMCwwLDAsMS4zNy4zNCwyLjY1LDIuNjUsMCwwLDAsMS40MS0uMzEsMSwxLDAsMCwwLC4zNS0uMzgsMSwxLDAsMCwwLC4xMi0uNSwxLDEsMCwwLDAtLjA5LS40Mi44OS44OSwwLDAsMC0uMjctLjM0LDIuMzQsMi4zNCwwLDAsMC0xLjEyLS40NGwtLjg4LS4xNWEzLDMsMCwwLDEtMS41Ni0uNzMsMiwyLDAsMCwxLS40NS0uNjMsMiwyLDAsMCwxLS4xNS0uNzYsMS44NCwxLjg0LDAsMCwxLC4xNy0uODYsMS43MywxLjczLDAsMCwxLC41NS0uNjgsMy4yNCwzLjI0LDAsMCwxLDItLjU4LDMsMywwLDAsMSwyLC41OCwyLjE2LDIuMTYsMCwwLDEsLjU2Ljc3LDIuMSwyLjEsMCwwLDEsLjE1LjkzaC0xYTEsMSwwLDAsMC0uMDgtLjU0LDEuMTIsMS4xMiwwLDAsMC0uMzItLjQ1LDIsMiwwLDAsMC0xLjI3LS4zMSwyLjQ3LDIuNDcsMCwwLDAtMS4yOC4zLjg3Ljg3LDAsMCwwLS4zMi4zNC44Ni44NiwwLDAsMC0uMTEuNDUsMS4wNywxLjA3LDAsMCwwLC4xLjM5LjkuOSwwLDAsMCwuMjUuMzMsMi4xLDIuMSwwLDAsMCwxLC40bC44Ny4xNGEzLjMyLDMuMzIsMCwwLDEsMS43NC43NywyLDIsMCwwLDEsLjQ1LjY2LDIsMiwwLDAsMSwuMTUuNzksMS44OSwxLjg5LDAsMCwxLS4xOS45MSwyLDIsMCwwLDEtLjYuNzFBMy40LDMuNCwwLDAsMSw0NzIuODUsNTkuNjhabTQuMjktLjA2di03LjdoMS4xMnY3LjdabTMuNTYsMC0zLjM1LTcuN2gxLjE3bDIuNTQsNiwyLjUzLTZoMS4xN2wtMy4zNSw3LjdabTMuMTQsMHYtNy43SDQ4NXY3LjdaIi8+PC9zdmc+" class="logo-img c6v77qb1bpwpao4 u8on21r1bpwpao5 cqqbiu41bpwpao8 esc7u9v1bpwpaob xcgqlg71bpwpao0" alt="Chase Travel home page"></RouterLink>
        
      </div>

      <!-- Right Section -->
      <div class="navbar__right">
        <!-- Sign In Button / Points Display -->
        <button
          v-if="!isSignedIn"
          @click="handleSignIn"
          :disabled="isLoading"
          class="navbar__signin-btn btn-primary"
        >
          <svg
            v-if="isLoading"
            class="navbar__spinner"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              stroke-width="3"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12"
              stroke="white"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <span v-else>Sign in</span>
        </button>

        <!-- Points Display (shown after sign in) -->
        <div
          v-else
          class="navbar__points"
          @mouseenter="showPopover"
          @mouseleave="hidePopover"
        >
          <div class="navbar__points-card">
            <img src="@/assets/SR_card_shadow.png" alt="Card" class="navbar__points-icon" />
            <span class="navbar__card-number">...{{ cardLastFour }}</span>
          </div>
          <span class="navbar__points-text">{{ formattedPoints }} pts</span>

          <!-- Popover -->
          <PointsPopover
            :points="points"
            :is-visible="isPopoverVisible"
            @close="closePopover"
          />
        </div>

        <!-- Sign Out Button (shown after sign in) -->
        <button
          v-if="isSignedIn"
          @click="handleSignOut"
          :disabled="isSigningOut"
          class="navbar__signin-btn btn-primary"
        >
          <svg
            v-if="isSigningOut"
            class="navbar__spinner"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              stroke-width="3"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12"
              stroke="white"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <template v-else>
            <span class="navbar__signout-text">Sign out</span>
            <svg class="navbar__signout-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7Z"
                fill="currentColor"
              />
              <path
                d="M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
                fill="currentColor"
              />
            </svg>
          </template>
        </button>

        <!-- User Profile Icon -->
        <!-- <button class="navbar__icon-btn" aria-label="User profile">
          <svg class="navbar__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <circle
              cx="12"
              cy="10"
              r="3"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M6.5 18.5C7.5 16.5 9.5 15 12 15C14.5 15 16.5 16.5 17.5 18.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button> -->
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  border-bottom: 1px solid rgba(229, 229, 229, 0.6);
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: -5rem;
  @media (max-width: $breakpoint-mobile) {
    margin-bottom: -10rem;
  }

  &__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0.45rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 120px;
      margin-bottom: -0.5rem;
    }
  }

  &__logo-icon {
    width: 32px;
    height: 32px;
  }

  &__logo-text {
    font-size: 1.5rem;
    font-weight: 400;
    color: #000;
    letter-spacing: -0.02em;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__signin-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    font-size: 0.875rem;
    min-width: 100px;
    height: 36px;
  }

  &__signout-text {
    display: inline;
  }

  &__signout-icon {
    display: none;
    width: 20px;
    height: 20px;
  }

  &__spinner {
    width: 20px;
    height: 20px;
    animation: spin 0.8s linear infinite;
  }

  &__points {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    animation: fadeIn 0.3s ease-in;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    &:hover {
      background-color: rgba(0, 45, 92, 0.05);
      border-color: #002d5c;
    }
  }

  &__points-card {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__points-icon {
    width: 28px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
  }

  &__card-number {
    font-size: 0.875rem;
    font-weight: 500;
    color: #000;
  }

  &__points-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0a8a4e;
  }

  &__icon-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    transition: background-color 0.2s ease;
    border-radius: 4px;

    &:hover {
      background-color: #f5f5f5;
    }

    &:active {
      background-color: #e5e5e5;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .navbar {
    &__container {
      padding: 0.5rem 1rem 0.4rem;
    }

    &__logo-text {
      font-size: 1.25rem;
    }

    &__signin-btn {
      padding: 0.375rem 1.25rem;
      font-size: 0.8125rem;
      min-width: 90px;

      &:has(.navbar__signout-icon), &:has(.navbar__spinner):disabled {
        min-width: auto;
        padding: 0.5rem;
      }
    }

    &__signout-text {
      display: none;
    }

    &__signout-icon {
      display: block;
    }

    &__points {
      padding: 0.375rem 0.75rem;
    }

    &__points-text {
      font-size: 0.8125rem;
    }

    &__right {
      gap: 0.5rem;
    }
  }
}
</style>
