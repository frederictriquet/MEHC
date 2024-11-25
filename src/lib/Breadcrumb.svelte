<script lang="ts">
  import { page } from '$app/stores';

  const getBreadCrumb = (host, path): Array<{ url: string; label: string }> => {
    return path
      .split('/')
      .reduce((acc, val, index) => {
        const url = index === 0 ? val : `${acc[index - 1].url}/${val}`;
        const elem = {
          url,
          label: val
        };
        acc.push(elem);
        return acc;
      }, [])
      .slice(1);

    //map(e => `${host}/${e}`)
  };

  $: crumbs = getBreadCrumb($page.url.host, $page.url.pathname);
</script>

{#if $page.url.pathname !== '/'}
  <nav class="bg-white border-b border-gray-200 flex" aria-label="Breadcrumb">
    <ol class="w-full mx-auto px-4 flex space-x-4 sm:px-6 lg:px-8">
      <li class="flex">
        <div class="flex items-center">
          <a href="/" class="text-gray-400 hover:text-gray-500">
            <!-- Heroicon name: solid/home -->
            <svg
              class="flex-shrink-0 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            <span class="sr-only">Home</span>
          </a>
        </div>
      </li>
      {#each crumbs as el, index}
        <li class="flex">
          <div class="flex items-center">
            <svg
              class="flex-shrink-0 w-6 h-full text-gray-200"
              viewBox="0 0 24 44"
              preserveAspectRatio="none"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
            {#if index === crumbs.length - 1}
              <span href={el.url} class="ml-4 text-sm font-bold text-gray-500 hover:text-gray-700"
                >{el.label}</span
              >
            {:else}
              <a href={el.url} class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >{el.label}</a
              >
            {/if}
          </div>
        </li>

        <!-- <li class="flex">
        <div class="flex items-center">
          <svg class="flex-shrink-0 w-6 h-full text-gray-200" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <a href="#" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700" aria-current="page">Project Nero</a>
        </div>
      </li> -->
      {/each}
    </ol>
  </nav>
{/if}
