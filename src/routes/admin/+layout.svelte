<script lang="ts">
	import Breadcrumb from "$lib/Breadcrumb.svelte";
  import "../../app.css";
</script>

<Breadcrumb />

<div class="container" style="padding: 50px 0 100px 0">
  <slot />
</div>
