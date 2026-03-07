<script setup lang="ts">
    import type { Email, SpamReport } from "../../lib/types";
    import { ref, unref } from "vue"
    import { ensureEmailFileIsWritten } from "../../lib/utils";
    import GoogleChrome from "../icons/GoogleChrome.vue"
    import Firefox from "../icons/Firefox.vue"
    import HtmlPreview from "./HtmlPreview.vue"
    import LinksChecker from "./LinksChecker.vue";
    import SpamAssassin from "./SpamAssassin.vue";
    import { open } from "@tauri-apps/plugin-shell";
    const { email } = defineProps<{ email: Email }>()

    const tabs = ["html", "html source", "text", "raw", 'links checker', 'Spam Assassin']
    const activeTab = ref(tabs[0])
    const spamScore = ref < number | undefined > (email.spamReport?.score)

    const spamScoreClasses = 'text-green-500'

    function setActiveTab(tab: string) {
        activeTab.value = tab
    }

    function setSpamReport(report: SpamReport) {
        spamScore.value = report.score
        email.spamReport = unref(report)
    }

    async function openInBrowser(browserName: 'google chrome' | 'firefox') {
        const filePath = await ensureEmailFileIsWritten(email);

        if (filePath) {
            open(filePath, browserName)
        }
    }
</script>

<template>
    <div class="w-full h-full flex flex-col overflow-hidden bg-white">
        <div class="flex items-center justify-between bg-white px-5 py-0 shrink-0 select-none">
            <ul class="flex items-center gap-6">
                <template v-for="tab in tabs" :key="tab">
                    <li class="cursor-pointer py-3 text-[11px] font-semibold tracking-wider transition-colors"
                        :class="activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
                        @click="setActiveTab(tab)">
                        {{ tab.toUpperCase() }}
                        <span v-if="spamScore !== undefined && tab === 'Spam Assassin'"
                            :class="`px-1 ml-0.5 text-[10px] rounded ${spamScoreClasses}`">
                            {{ spamScore }}
                        </span>
                    </li>
                </template>
            </ul>
        </div>

        <!-- tab contents-->
        <div class="flex-1 w-full overflow-hidden relative">
            <div class="h-full w-full bg-white text-sm">
                <!-- html preview tab -->
                <div class="relative h-full w-full overflow-auto" :class="[activeTab === 'html' ? 'block' : 'hidden']">
                    <div class="p-4 min-h-full">
                        <HtmlPreview :html="email.html" />
                    </div>
                    <!-- Browser icons absolute positioned -->
                    <div class="absolute top-2 right-2 flex gap-1 bg-white/80 backdrop-blur rounded-md p-1 shadow-sm border border-gray-100 z-10 opacity-0 hover:opacity-100 transition-opacity">
                        <button @click="() => openInBrowser('google chrome')" type="button"
                            title="Preview in Google chrome" class="p-1 hover:bg-gray-100 rounded transition text-gray-500 hover:text-gray-900">
                            <GoogleChrome class="w-4 h-4" />
                        </button>
                        <button @click="() => openInBrowser('firefox')" type="button" title="Preview in Firefox"
                            class="p-1 hover:bg-gray-100 rounded transition text-gray-500 hover:text-gray-900">
                            <Firefox class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <!-- html source tab -->
                <div class="w-full h-full" :class="[activeTab === 'html source' ? 'block' : 'hidden']">
                    <textarea readOnly
                        class="w-full h-full p-4 border-0 font-mono text-xs resize-none focus:ring-0 bg-gray-50 text-gray-600"
                        :value="email.html"></textarea>
                </div>

                <!-- text tab -->
                <div class="w-full h-full" :class="[activeTab === 'text' ? 'block' : 'hidden']">
                    <textarea
                       readOnly
                        class="w-full h-full p-4 border-0 font-mono text-xs resize-none focus:ring-0 bg-white text-gray-800"
                        :value="email.text"></textarea>
                </div>

                <!-- raw tab -->
                <div class="w-full h-full" :class="[activeTab === 'raw' ? 'block' : 'hidden']">
                    <textarea readOnly
                        class="w-full h-full p-4 border-0 font-mono text-[10px] resize-none focus:ring-0 bg-gray-900 text-gray-300"
                        :value="email.raw"></textarea>
                </div>

                <!-- broken link cheker -->
                <div class="h-full overflow-auto p-4" :class="[activeTab === 'links checker' ? 'block' : 'hidden']">
                    <LinksChecker :email="email" />
                </div>

                <!-- spam assasin tab -->
                <div class="h-full overflow-auto p-4" :class="[activeTab === 'Spam Assassin' ? 'block' : 'hidden']">
                    <KeepAlive>
                        <SpamAssassin :email="email" @updateSpamReport="setSpamReport" />
                    </KeepAlive>
                </div>
            </div>
        </div>
    </div>
</template>
