<script lang="ts">
  export let data;
</script>
<div>
  <h1 class="text-center">{data.name}</h1>
  <img class="mx-auto" src={data.picture_data} alt="">
  <p class="text-sm text-center">En cas d'égalité, c'est la rapidité des votes qui a fait la différence.</p>
</div>
