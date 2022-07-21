# chartsss

## Static charts

- Provide a detailed summary
- Provide hidden content (e.g. table) with the same information

- Structure
  - Heading
  - Subheading
  - SVG chart title
  - SVG chart description

## Interactive charts

- Serial access to data (table alternative)
- Tab access

---

- `use:friendly.chart`: wraps heading + visual + source + everything else that belongs to a charts
- `use:friendly.visual`: hides section for screen readers (removes semantics and used aria-hidden)

Information given for ??

- `use:friendly.axis`: ??
- `use:friendly.group`: ??
- `use:friendly.element`: ??

Visa chart comps

`<p>`: Screen reader instructions

- `title`: Gives the chart an alternate title to be used by screen readers. (`<h2 />`) as `<h2>Chart title: MY TITLE</h2>` (taken from chart if given)
- `subtitle` (`<h3 />`) as `<h3>Chart subtitle: My chart subtitle</h3>` (taken from chart if given)
- `executiveSummary`: Use this to describe the biggest takeaway of the chart. (`<p/>`)
- `purpose`: Use this to describe the purpose of this particular chart. (`<h3 />`)
- `longDescription`: Use this to add a helpful description of the chart.
- `structureNotes`: Use this to describe special visual features of the chart, such as sorting, color grouping, etc.
- `statisticalNotes`: Use this to provide any statistical explanations, such as trends, clusters, patterns, or outliers.
- `contextExplanation`: Use this to explain any controls or content on your page that affect or are affected by this chart.

```html
<div
	class="vcl-accessibility-instructions"
	id="chart-instructions-bar-chart-Interaction"
	style="position: absolute; width: 675px;"
>
	<!-- Automatically generated -->
	<p class="screen-reader-info vcl-region-label">
		Keyboard interactive bar-chart, Titled: My custom title. This section contains additional
		information about this chart. Pressing TAB will focus the keyboard instructions menu. Tabbing
		again takes you to the chart area.
	</p>

	<!-- `title` (used from visible chart if given) -->
	<h2 class="screen-reader-info vcl-access-title">Chart title: My custom title</h2>

	<!-- `subtitle` (used from visible chart if given) -->
	<h3 class="screen-reader-info vcl-access-subtitle">
		Chart subtitle: Rolling 12 month trend of count.
	</h3>

	<!-- `executiveSummary` -->
	<p class="screen-reader-info vcl-access-executive-summary" data-level="h3"></p>

	<!-- `purpose` -->
	<h3 class="screen-reader-info vcl-access-purpose-heading">Purpose</h3>
	<p class="screen-reader-info vcl-access-purpose" data-level="h3">
		This chart presents the count by month to view the trend in count over the year.
	</p>

	<!-- `longDescription` -->
	<h3 class="screen-reader-info vcl-access-long-description-heading">Long Description</h3>
	<p class="screen-reader-info vcl-access-long-description" data-level="h3"></p>

	<!-- `contextExplanation` -->
	<p data-level="h3" class="screen-reader-info vcl-access-context">
		This example of a bar chart was selected through example list on the sidebar.
	</p>

	<!-- Stats -->
	<h3 class="screen-reader-info vcl-access-structure-heading">Structure</h3>
	<p class="screen-reader-info vcl-access-statistics" data-level="h4"></p>

	<!-- Chart layout description -->
	<h4 class="screen-reader-info vcl-access-chart-layout-heading">Chart Layout Description</h4>
	<p class="screen-reader-info vcl-access-layout">This is a bar-chart with 12 bars.</p>
	<p class="screen-reader-info vcl-access-xAxis">
		The chart has a horizontal X Axis, titled Month with a range that starts with Jan and ends with
		Dec.
	</p>
	<p class="screen-reader-info vcl-access-yAxis"></p>

	<!-- structureNotes -->
	<h4 class="screen-reader-info vcl-access-notes-heading">Notes about the chart structure</h4>
	<p class="screen-reader-info vcl-access-notes" data-level="h4" data-annotationlevel="h3">
		A focused bar or hovered bar changes is highlighted by an added dashed border. A clicked bar has
		a solid border added when clicked, and will stay until clicked again, even if it is hovered.
	</p>
</div>
```

```html
<div
	class="VCL-controller"
	id="chart-area-line-chart-Default"
	data-group="category"
	aria-label="Interactive line-chart."
	role="application"
	tabindex="0"
	aria-activedescendant="null"
	style="position: absolute; top: 0px; left: 0px; opacity: 0; pointer-events: none; width: 650px; height: 300px;"
>
	Interactive line-chart.
	<figure role="figure">
		<div
			role="img"
			id="node-line-chart-Default-807410-162193-543872"
			tabindex="-1"
			aria-label="Group A. June 01 2016. 8.5b. Point 6 of 12."
			style="position: absolute; padding: 0px; margin: 0px; overflow: visible; left: 280.596px; top: 73.4156px; width: 10px; height: 10px; pointer-events: none;"
		>
			Group A. June 01 2016. 8.5b. Point 6 of 12.
		</div>
	</figure>
	<figure role="figure">
		<div
			role="img"
			id="node-line-chart-Default-178714-319775-21307"
			tabindex="-1"
			aria-label="Group A. July 01 2016. 8.8b. Point 7 of 12."
			class="VCL-controller-focused"
			style="position: absolute; padding: 0px; margin: 0px; overflow: visible; left: 318.152px; top: 64.5872px; width: 10px; height: 10px; pointer-events: none;"
		>
			Group A. July 01 2016. 8.8b. Point 7 of 12.
		</div>
	</figure>
	<figure role="figure">
		<div
			role="img"
			id="node-line-chart-Default-809077-115557-121908"
			tabindex="-1"
			aria-label="Group A. August 01 2016. 8.8b. Point 8 of 12."
			style="position: absolute; padding: 0px; margin: 0px; overflow: visible; left: 356.961px; top: 63.6119px; width: 10px; height: 10px; pointer-events: none;"
		>
			Group A. August 01 2016. 8.8b. Point 8 of 12.
		</div>
	</figure>
</div>
```

```html
<svg
	width="650"
	height="300"
	viewBox="0 0 650 300"
	role="presentation"
	focusable="false"
	tabindex="-1"
	style="overflow: hidden;"
	class="vcl-svg"
>
	<g id="visa-viz-margin-container-g-line-chart-Default" transform="translate(6.5, 3)">
		<g id="visa-viz-padding-container-g-line-chart-Default" transform="translate(50, 20)">
			<g class="grid-group" aria-hidden="true" role="presentation" focusable="false">
				<g
					class="grid bottom"
					data-testid="grid-bottom"
					opacity="0"
					fill="none"
					font-size="10"
					font-family="sans-serif"
					text-anchor="middle"
				>
					<path class="domain" stroke="currentColor" d="M0.5,224V0.5H497.5V224"></path>
					<g class="tick" opacity="1" transform="translate(39.25640218303946,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(78.0649664147775,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(114.36975230898405,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(153.1261544920235,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(190.6828295549958,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(229.49139378673385,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(267.04806884970617,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(305.8566330814442,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(344.6651973131822,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(382.22187237615447,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(421.0825986565911,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(458.6392737195634,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(497.44783795130144,0)">
						<line stroke="currentColor" y2="224"></line>
						<text fill="currentColor" y="227" dy="0.71em"></text>
					</g>
				</g>
				<g
					class="grid left"
					data-testid="grid-left"
					opacity="1"
					fill="none"
					font-size="10"
					font-family="sans-serif"
					text-anchor="end"
				>
					<path class="domain" stroke="currentColor" d="M497,224.5H0.5V0.5H497"></path>
					<g class="tick" opacity="1" transform="translate(0,220.3511419075022)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,190.36759826513372)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,160.38405462276523)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,130.40051098039672)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,100.41696733802823)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,70.43342369565974)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,40.44988005329124)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,10.466336410922754)">
						<line stroke="currentColor" x2="497"></line>
						<text fill="currentColor" x="-3" dy="0.32em"></text>
					</g>
				</g>
			</g>
			<g
				class="line-group line-wrapper-group"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				<path
					class="line-plot"
					d="M38.80856423173804,79.79816729742207L77.61712846347608,81.06002164330614L113.92191435768261,59.17420748190012L152.73047858942067,59.89364501125863L190.28715365239296,52.28510885833761L229.09571788413098,55.41561512149087L266.6523929471033,46.58715130138242L305.46095717884134,45.61187960566501L344.2695214105794,56.07656204320423L381.8261964735516,38.392732478009854L420.63476070528964,43.76228828705635L458.19143576826195,18.666666666666675"
					data-d="M38.80856423173804,79.79816729742207L77.61712846347608,81.06002164330614L113.92191435768261,59.17420748190012L152.73047858942067,59.89364501125863L190.28715365239296,52.28510885833761L229.09571788413098,55.41561512149087L266.6523929471033,46.58715130138242L305.46095717884134,45.61187960566501L344.2695214105794,56.07656204320423L381.8261964735516,38.392732478009854L420.63476070528964,43.76228828705635L458.19143576826195,18.666666666666675"
					data-translate-x="56.5"
					cursor="default"
					stroke-dasharray=""
					stroke-dashoffset="0"
					stroke-width="2"
					stroke="#35495a"
					fill="none"
					opacity="1"
				></path>
				<path
					class="line-plot"
					d="M38.80856423173804,112.78006530402743L77.61712846347608,171.01065257041165L113.92191435768261,179.1083820513741L152.73047858942067,143.8475672098904L190.28715365239296,178.2159921562853L229.09571788413098,205.33333333333334L266.6523929471033,202.50157824169858L305.46095717884134,117.57238434734938L344.2695214105794,152.0239016987834L381.8261964735516,170.32032450443123L420.63476070528964,106.72772993603019L458.19143576826195,141.59919560037747"
					data-d="M38.80856423173804,112.78006530402743L77.61712846347608,171.01065257041165L113.92191435768261,179.1083820513741L152.73047858942067,143.8475672098904L190.28715365239296,178.2159921562853L229.09571788413098,205.33333333333334L266.6523929471033,202.50157824169858L305.46095717884134,117.57238434734938L344.2695214105794,152.0239016987834L381.8261964735516,170.32032450443123L420.63476070528964,106.72772993603019L458.19143576826195,141.59919560037747"
					data-translate-x="56.5"
					cursor="default"
					stroke-dasharray="8,2"
					stroke-dashoffset="0"
					stroke-width="2"
					stroke="#6868ba"
					fill="none"
					opacity="1"
				></path>
			</g>
			<g
				class="line-series-wrapper"
				filter="url(#VCL-t-s-f-ffffffline-chart-Default)"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				<text
					opacity="1"
					class="line-series-label"
					cursor="default"
					fill="#587893"
					x="507"
					y="18.666666666666675"
					text-anchor="start"
					dx="0.1em"
					dy="0.3em"
					data-x="507"
					data-y="23.166666666666675"
					data-translate-x="56.5"
					data-text-anchor="start"
					data-use-dx="false"
					data-use-dy="false"
				>
					Group A
				</text>
				<text
					opacity="1"
					class="line-series-label"
					cursor="default"
					fill="#6b6bbc"
					x="507"
					y="141.59919560037747"
					text-anchor="start"
					dx="0.1em"
					dy="0.3em"
					data-x="507"
					data-y="146.09919560037747"
					data-translate-x="56.5"
					data-text-anchor="start"
					data-use-dx="false"
					data-use-dy="false"
				>
					Group B
				</text>
			</g>
			<g class="dot-group">
				<g
					class="line-dot-wrapper"
					fill="#7c99b1"
					tabindex="-1"
					role="presentation"
					focusable="false"
					opacity="1"
					cursor="default"
					id="line-chart-Default-448532-24365-342814"
				>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="38.80856423173804"
						data-cy="79.79816729742207"
						data-r="5"
						id="line-chart-Default-587935-452128-662020"
						data-role="img"
						opacity="1"
						data-index="0"
						cx="38.80856423173804"
						cy="79.79816729742207"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="77.61712846347608"
						data-cy="81.06002164330614"
						data-r="5"
						id="line-chart-Default-365004-429784-939131"
						data-role="img"
						opacity="1"
						data-index="1"
						cx="77.61712846347608"
						cy="81.06002164330614"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="113.92191435768261"
						data-cy="59.17420748190012"
						data-r="5"
						id="line-chart-Default-393454-37635-570684"
						data-role="img"
						opacity="1"
						data-index="2"
						cx="113.92191435768261"
						cy="59.17420748190012"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="152.73047858942067"
						data-cy="59.89364501125863"
						data-r="5"
						id="line-chart-Default-702967-146568-648948"
						data-role="img"
						opacity="1"
						data-index="3"
						cx="152.73047858942067"
						cy="59.89364501125863"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="190.28715365239296"
						data-cy="52.28510885833761"
						data-r="5"
						id="line-chart-Default-52452-990255-449325"
						data-role="img"
						opacity="1"
						data-index="4"
						cx="190.28715365239296"
						cy="52.28510885833761"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="229.09571788413098"
						data-cy="55.41561512149087"
						data-r="5"
						id="line-chart-Default-807410-162193-543872"
						data-role="img"
						opacity="1"
						data-index="5"
						cx="229.09571788413098"
						cy="55.41561512149087"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="266.6523929471033"
						data-cy="46.58715130138242"
						data-r="5"
						id="line-chart-Default-178714-319775-21307"
						data-role="img"
						opacity="1"
						data-index="6"
						cx="266.6523929471033"
						cy="46.58715130138242"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="305.46095717884134"
						data-cy="45.61187960566501"
						data-r="5"
						id="line-chart-Default-809077-115557-121908"
						data-role="img"
						opacity="1"
						data-index="7"
						cx="305.46095717884134"
						cy="45.61187960566501"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="344.2695214105794"
						data-cy="56.07656204320423"
						data-r="5"
						id="line-chart-Default-693527-171107-940332"
						data-role="img"
						opacity="1"
						data-index="8"
						cx="344.2695214105794"
						cy="56.07656204320423"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="381.8261964735516"
						data-cy="38.392732478009854"
						data-r="5"
						id="line-chart-Default-820492-657304-736888"
						data-role="img"
						opacity="1"
						data-index="9"
						cx="381.8261964735516"
						cy="38.392732478009854"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="420.63476070528964"
						data-cy="43.76228828705635"
						data-r="5"
						id="line-chart-Default-919488-946748-400306"
						data-role="img"
						opacity="1"
						data-index="10"
						cx="420.63476070528964"
						cy="43.76228828705635"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#7c99b1"
						stroke="#35495a"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="458.19143576826195"
						data-cy="18.666666666666675"
						data-r="5"
						id="line-chart-Default-525115-300027-168913"
						data-role="img"
						opacity="1"
						data-index="11"
						cx="458.19143576826195"
						cy="18.666666666666675"
					></circle>
				</g>
				<g
					class="line-dot-wrapper"
					fill="#cacae7"
					tabindex="-1"
					role="presentation"
					focusable="false"
					opacity="1"
					cursor="default"
					id="line-chart-Default-646585-88456-407934"
				>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="38.80856423173804"
						data-cy="112.78006530402743"
						data-r="5"
						id="line-chart-Default-562995-173934-950943"
						data-role="img"
						opacity="1"
						data-index="0"
						cx="38.80856423173804"
						cy="112.78006530402743"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="77.61712846347608"
						data-cy="171.01065257041165"
						data-r="5"
						id="line-chart-Default-236969-159229-17791"
						data-role="img"
						opacity="1"
						data-index="1"
						cx="77.61712846347608"
						cy="171.01065257041165"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="113.92191435768261"
						data-cy="179.1083820513741"
						data-r="5"
						id="line-chart-Default-804509-281939-813021"
						data-role="img"
						opacity="1"
						data-index="2"
						cx="113.92191435768261"
						cy="179.1083820513741"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="152.73047858942067"
						data-cy="143.8475672098904"
						data-r="5"
						id="line-chart-Default-734975-927235-365848"
						data-role="img"
						opacity="1"
						data-index="3"
						cx="152.73047858942067"
						cy="143.8475672098904"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="190.28715365239296"
						data-cy="178.2159921562853"
						data-r="5"
						id="line-chart-Default-481792-489642-748994"
						data-role="img"
						opacity="1"
						data-index="4"
						cx="190.28715365239296"
						cy="178.2159921562853"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="229.09571788413098"
						data-cy="205.33333333333334"
						data-r="5"
						id="line-chart-Default-240990-752378-748165"
						data-role="img"
						opacity="1"
						data-index="5"
						cx="229.09571788413098"
						cy="205.33333333333334"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="266.6523929471033"
						data-cy="202.50157824169858"
						data-r="5"
						id="line-chart-Default-364530-331117-74996"
						data-role="img"
						opacity="1"
						data-index="6"
						cx="266.6523929471033"
						cy="202.50157824169858"
						class=""
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="305.46095717884134"
						data-cy="117.57238434734938"
						data-r="5"
						id="line-chart-Default-777283-326181-703009"
						data-role="img"
						opacity="1"
						data-index="7"
						cx="305.46095717884134"
						cy="117.57238434734938"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="344.2695214105794"
						data-cy="152.0239016987834"
						data-r="5"
						id="line-chart-Default-44855-239170-927356"
						data-role="img"
						opacity="1"
						data-index="8"
						cx="344.2695214105794"
						cy="152.0239016987834"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="381.8261964735516"
						data-cy="170.32032450443123"
						data-r="5"
						id="line-chart-Default-912739-620005-639549"
						data-role="img"
						opacity="1"
						data-index="9"
						cx="381.8261964735516"
						cy="170.32032450443123"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="420.63476070528964"
						data-cy="106.72772993603019"
						data-r="5"
						id="line-chart-Default-864729-878673-652414"
						data-role="img"
						opacity="1"
						data-index="10"
						cx="420.63476070528964"
						cy="106.72772993603019"
					></circle>
					<circle
						tabindex="-1"
						role="presentation"
						focusable="false"
						stroke-width="2"
						fill="#cacae7"
						stroke="#6868ba"
						cursor="default"
						data-fill="true"
						data-translate-x="56.5"
						r="5"
						data-cx="458.19143576826195"
						data-cy="141.59919560037747"
						data-r="5"
						id="line-chart-Default-835849-559110-699191"
						data-role="img"
						opacity="1"
						data-index="11"
						cx="458.19143576826195"
						cy="141.59919560037747"
					></circle>
				</g>
			</g>
			<g
				class="line-dataLabel-group"
				filter="url(#VCL-t-s-f-ffffffline-chart-Default)"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				<g class="line-label-wrapper" opacity="1" fill="#7c99b1">
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="38.80856423173804"
						y="79.79816729742207"
						dy="-0.6em"
						text-anchor="middle"
						data-x="38.80856423173804"
						data-y="79.79816729742207"
						data-translate-x="56.5"
						cursor="default"
					>
						7.7b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="77.61712846347608"
						y="81.06002164330614"
						dy="-0.6em"
						text-anchor="middle"
						data-x="77.61712846347608"
						data-y="81.06002164330614"
						data-translate-x="56.5"
						cursor="default"
					>
						7.6b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="113.92191435768261"
						y="59.17420748190012"
						dy="-0.6em"
						text-anchor="middle"
						data-x="113.92191435768261"
						data-y="59.17420748190012"
						data-translate-x="56.5"
						cursor="default"
					>
						8.4b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="152.73047858942067"
						y="59.89364501125863"
						dy="-0.6em"
						text-anchor="middle"
						data-x="152.73047858942067"
						data-y="59.89364501125863"
						data-translate-x="56.5"
						cursor="default"
					>
						8.3b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="190.28715365239296"
						y="52.28510885833761"
						dy="-0.6em"
						text-anchor="middle"
						data-x="190.28715365239296"
						data-y="52.28510885833761"
						data-translate-x="56.5"
						cursor="default"
					>
						8.6b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="229.09571788413098"
						y="55.41561512149087"
						dy="-0.6em"
						text-anchor="middle"
						data-x="229.09571788413098"
						data-y="55.41561512149087"
						data-translate-x="56.5"
						cursor="default"
					>
						8.5b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="266.6523929471033"
						y="46.58715130138242"
						dy="-0.6em"
						text-anchor="middle"
						data-x="266.6523929471033"
						data-y="46.58715130138242"
						data-translate-x="56.5"
						cursor="default"
					>
						8.8b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="305.46095717884134"
						y="45.61187960566501"
						dy="-0.6em"
						text-anchor="middle"
						data-x="305.46095717884134"
						data-y="45.61187960566501"
						data-translate-x="56.5"
						cursor="default"
					>
						8.8b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="344.2695214105794"
						y="56.07656204320423"
						dy="-0.6em"
						text-anchor="middle"
						data-x="344.2695214105794"
						data-y="56.07656204320423"
						data-translate-x="56.5"
						cursor="default"
					>
						8.5b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="381.8261964735516"
						y="38.392732478009854"
						dy="-0.6em"
						text-anchor="middle"
						data-x="381.8261964735516"
						data-y="38.392732478009854"
						data-translate-x="56.5"
						cursor="default"
					>
						9.1b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="420.63476070528964"
						y="43.76228828705635"
						dy="-0.6em"
						text-anchor="middle"
						data-x="420.63476070528964"
						data-y="43.76228828705635"
						data-translate-x="56.5"
						cursor="default"
					>
						8.9b
					</text>
					<text
						fill="#587893"
						opacity="1"
						class="line-dataLabel"
						x="458.19143576826195"
						y="18.666666666666675"
						dy="-0.6em"
						text-anchor="middle"
						data-x="458.19143576826195"
						data-y="18.666666666666675"
						data-translate-x="56.5"
						cursor="default"
					>
						9.7b
					</text>
				</g>
				<g class="line-label-wrapper" opacity="1" fill="#cacae7">
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="38.80856423173804"
						y="112.78006530402743"
						dy="-0.6em"
						text-anchor="middle"
						data-x="38.80856423173804"
						data-y="112.78006530402743"
						data-translate-x="56.5"
						cursor="default"
					>
						6.6b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="77.61712846347608"
						y="171.01065257041165"
						dy="-0.6em"
						text-anchor="middle"
						data-x="77.61712846347608"
						data-y="171.01065257041165"
						data-translate-x="56.5"
						cursor="default"
					>
						4.6b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="113.92191435768261"
						y="179.1083820513741"
						dy="-0.6em"
						text-anchor="middle"
						data-x="113.92191435768261"
						data-y="179.1083820513741"
						data-translate-x="56.5"
						cursor="default"
					>
						4.4b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="152.73047858942067"
						y="143.8475672098904"
						dy="-0.6em"
						text-anchor="middle"
						data-x="152.73047858942067"
						data-y="143.8475672098904"
						data-translate-x="56.5"
						cursor="default"
					>
						5.5b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="190.28715365239296"
						y="178.2159921562853"
						dy="-0.6em"
						text-anchor="middle"
						data-x="190.28715365239296"
						data-y="178.2159921562853"
						data-translate-x="56.5"
						cursor="default"
					>
						4.4b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="229.09571788413098"
						y="205.33333333333334"
						dy="-0.6em"
						text-anchor="middle"
						data-x="229.09571788413098"
						data-y="205.33333333333334"
						data-translate-x="56.5"
						cursor="default"
					>
						3.5b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="266.6523929471033"
						y="202.50157824169858"
						dy="-0.6em"
						text-anchor="middle"
						data-x="266.6523929471033"
						data-y="202.50157824169858"
						data-translate-x="56.5"
						cursor="default"
					>
						3.6b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="305.46095717884134"
						y="117.57238434734938"
						dy="-0.6em"
						text-anchor="middle"
						data-x="305.46095717884134"
						data-y="117.57238434734938"
						data-translate-x="56.5"
						cursor="default"
					>
						6.4b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="344.2695214105794"
						y="152.0239016987834"
						dy="-0.6em"
						text-anchor="middle"
						data-x="344.2695214105794"
						data-y="152.0239016987834"
						data-translate-x="56.5"
						cursor="default"
					>
						5.3b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="381.8261964735516"
						y="170.32032450443123"
						dy="-0.6em"
						text-anchor="middle"
						data-x="381.8261964735516"
						data-y="170.32032450443123"
						data-translate-x="56.5"
						cursor="default"
					>
						4.7b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="420.63476070528964"
						y="106.72772993603019"
						dy="-0.6em"
						text-anchor="middle"
						data-x="420.63476070528964"
						data-y="106.72772993603019"
						data-translate-x="56.5"
						cursor="default"
					>
						6.8b
					</text>
					<text
						fill="#6b6bbc"
						opacity="1"
						class="line-dataLabel"
						x="458.19143576826195"
						y="141.59919560037747"
						dy="-0.6em"
						text-anchor="middle"
						data-x="458.19143576826195"
						data-y="141.59919560037747"
						data-translate-x="56.5"
						cursor="default"
					>
						5.6b
					</text>
				</g>
			</g>
			<g
				class="line-reference-line-group"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			></g>
			<g
				class="x axis bottom"
				data-testid="x-axis"
				transform="translate(0, 224)"
				opacity="1"
				fill="none"
				font-size="10"
				font-family="sans-serif"
				text-anchor="middle"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				<path class="domain" stroke="currentColor" d="M0.5,0.5H497.5"></path>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(39.25640218303946,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Jan</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(78.0649664147775,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Feb</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(114.36975230898405,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Mar</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(153.1261544920235,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Apr</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(190.6828295549958,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">May</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(229.49139378673385,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Jun</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(267.04806884970617,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Jul</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(305.8566330814442,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Aug</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(344.6651973131822,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Sep</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(382.22187237615447,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Oct</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(421.0825986565911,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Nov</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(458.6392737195634,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Dec</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">16</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(497.44783795130144,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em">
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="0.71em">Jan</tspan>
						<tspan data-testid="axis-tick-text-tspan" x="0" y="10" dy="1.71em">17</tspan>
					</text>
				</g>
			</g>
			<text
				class="x axis-label bottom"
				data-testid="x-axis-label"
				transform="translate(0, 0)"
				x="248.5"
				y="274"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				X Axis
			</text>
			<g
				class="y axis left"
				data-testid="y-axis"
				opacity="1"
				fill="none"
				font-size="10"
				font-family="sans-serif"
				text-anchor="end"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				<path class="domain" stroke="currentColor" d="M0.5,224.5V0.5"></path>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,220.3511419075022)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">3b</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,190.36759826513372)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">4b</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,160.38405462276523)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">5b</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,130.40051098039672)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">6b</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,100.41696733802823)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">7b</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,70.43342369565974)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">8b</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,40.44988005329124)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">9b</tspan>
					</text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(0,10.466336410922754)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" x2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" x="-10" dy="0.32em">
						<tspan data-testid="axis-tick-text-tspan" x="-8" dy="0.32em">10b</tspan>
					</text>
				</g>
			</g>
			<text
				class="y axis-label left"
				data-testid="y-axis-label"
				transform="rotate(-90)"
				y="-50"
				x="-112"
				dy="1em"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				Y Axis
			</text>
			<g
				class="axis-mark-x axis-mark"
				data-testid="x-axis-mark"
				transform="translate(0, 309.8017728346077)"
				opacity="1"
				fill="none"
				font-size="10"
				font-family="sans-serif"
				text-anchor="middle"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			>
				<path class="domain" stroke="currentColor" d="M0.5,0.5H497.5"></path>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(39.25640218303946,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(78.0649664147775,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(114.36975230898405,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(153.1261544920235,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(190.6828295549958,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(229.49139378673385,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(267.04806884970617,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(305.8566330814442,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(344.6651973131822,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(382.22187237615447,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(421.0825986565911,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(458.6392737195634,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
				<g
					class="tick"
					data-testid="axis-tick"
					opacity="1"
					transform="translate(497.44783795130144,0)"
				>
					<line data-testid="axis-tick-line" stroke="currentColor" y2="0"></line>
					<text data-testid="axis-tick-text" fill="currentColor" y="10" dy="0.71em"></text>
				</g>
			</g>
			<g
				class="vcl-annotation-group"
				data-testid="annotation-group"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			></g>
			<g
				class="editable vcl-annotation-group"
				data-testid="editable-annotation-group"
				aria-hidden="true"
				role="presentation"
				focusable="false"
			></g>
		</g>
	</g>
	<defs>
		<filter
			class="vcl-inversion-filter"
			color-interpolation-filters="sRGB"
			id="inversion-line-chart-Default"
		>
			<feColorMatrix
				in="SourceGraphic"
				type="matrix"
				values="-1 0 0 0 1 
        0 -1 0 0 1 
        0 0 -1 0 1
        0 0 0 1 0"
			></feColorMatrix>
			<feColorMatrix type="hueRotate" values="180"></feColorMatrix>
		</filter>
		<filter id="VCL-t-s-f-ffffffline-chart-Default" class="VCL-t-s-f-ffffff">
			<feMorphology
				in="SourceAlpha"
				result="dilatedText"
				operator="dilate"
				radius="1.5"
			></feMorphology>
			<feFlood flood-color="#ffffff" flood-opacity="1" result="whiteTextFlood"></feFlood>
			<feComposite
				in="whiteTextFlood"
				in2="dilatedText"
				operator="in"
				result="textOutline"
			></feComposite>
			<feMerge>
				<feMergeNode in="textOutline"></feMergeNode>
				<feMergeNode in="textOutline"></feMergeNode>
				<feMergeNode in="textOutline"></feMergeNode>
				<feMergeNode in="SourceGraphic"></feMergeNode>
			</feMerge>
		</filter>
	</defs>
</svg>
```
