<script setup lang="ts">
import type { Email } from "../../lib/types";
import { ref } from "vue"
import { ensureEmailFileIsWritten } from "../../lib/utils";
import GoogleChrome from "../icons/GoogleChrome.vue"
import Firefox from "../icons/Firefox.vue"
import HtmlPreview from "./HtmlPreview.vue"
import LinksChecker from "./LinksChecker.vue";
import SpamAssassin from "./SpamAssassin.vue";
import { open } from "@tauri-apps/api/shell";

const { email } = defineProps<{
  email: Email
}>()

const tabs = ["html", "html source", "text", "raw", 'links checker', 'Spam Assassin']
const activeTab = ref(tabs[0])
const spamScore = ref<number | undefined>(email.spamScore)

const spamScoreClasses = 'text-green-500'

function setActiveTab(tab: string) {
  activeTab.value = tab
}

function setSpamScore(score: number) {
  spamScore.value = score
  email.spamScore = score
}

async function openInBrowser(browserName: 'google chrome' | 'firefox') {
  const filePath = await ensureEmailFileIsWritten(email);

  if (filePath) {
    open(filePath, browserName)
  }
}
</script>

<template>
  <div class="w-full h-full overflow-y-hidden">
    <div class="flex items-center justify-between bg-gray-200 px-5 py-2 text-xs font-medium text-gray-700">
      <ul class="flex items-center space-x-3">
        <template v-for="tab in tabs" :key="tab">
          <li class="cursor-default rounded px-3 py-1" :class="{ 'bg-white': activeTab === tab }"
            @click="setActiveTab(tab)">
            {{ tab.toUpperCase() }}
            <span v-if="spamScore !== undefined && tab === 'Spam Assassin'"
              :class="`px-1 ml-0.5 text-xs rounded ${spamScoreClasses}`">
              {{ spamScore }}
            </span>
          </li>
        </template>
      </ul>
    </div>

    <!-- tab contents-->
    <div class="h-full w-full overflow-auto p-5">
      <div class="h-full w-full rounded-xl bg-white text-sm">
        <!-- html preview tab -->
        <div class="relative h-full w-full" :class="[activeTab === 'html' ? 'flex' : 'hidden']">
          <HtmlPreview :html="email.html" />
          <div class="z-40  absolute top-0 right-0 flex gap-2">
            <button @click="() => openInBrowser('google chrome')" type="button" title="Preview in Google chrome"
              class=" p-1 hover:bg-gray-200 rounded transition">
              <GoogleChrome class="w-5 h-5" />
            </button>
            <button @click="() => openInBrowser('firefox')" type="button" title="Preview in Firefox" class=" p-1
              hover:bg-gray-200 rounded transition">
              <Firefox class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- html source tab -->
        <div class="w-full h-full" :class="[activeTab === 'html source' ? 'flex' : 'hidden']">
          <textarea readOnly class="w-full border-transparent border font-mono overflow-auto text-sm
                            focus:border-0 focus:ring-0" :value="email.html"></textarea>
        </div>

        <!-- text tab -->
        <div class="w-full h-full" :class="[activeTab === 'text' ? 'flex' : 'hidden']">
          <textarea readOnly class="w-full border-transparent border font-mono overflow-auto text-sm
                            focus:border-0 focus:ring-0" :value="email.text"></textarea>
        </div>

        <!-- raw tab -->
        <div class="w-full h-full" :class="[activeTab === 'raw' ? 'flex' : 'hidden']">
          <textarea readOnly class="w-full border-transparent border font-mono overflow-auto text-sm
                            focus:border-0 focus:ring-0" :value="email.raw"></textarea>
        </div>

        <!-- broken link cheker -->
        <div :class="[activeTab === 'links checker' ? 'flex' : 'hidden']">
          <LinksChecker :email="email" />
        </div>

        <!-- spam assasin tab -->
        <div :class="[activeTab === 'Spam Assassin' ? 'block' : 'hidden']">
          <SpamAssassin :email="email" @updateSpamScore="setSpamScore" />
        </div>
      </div>
    </div>
  </div>
</template>
