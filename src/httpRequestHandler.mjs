import fs from "node:fs"
import path from "node:path"

import {loadResource} from "@vipen/target-js"

const index_html_code = loadResource("text://client.html")
const index_js_code = loadResource("esmodule://client.mjs")

import runner_slave_code from "@joytest/test-case-runner/source"
import getMimeType from "@anio-js-foundation/get-mime-type"

export default function(context, request, response) {
	const {jtest_session} = context

	if (request.url.startsWith("/project_files/")) {
		const filename = path.basename(request.url)
		const mime_type = getMimeType(filename)

		let file = fs.readFileSync(
			path.join(jtest_session.options.project_root, request.url.slice(
				"/project_files/".length
			))
		)

		response.setHeader("Content-Type", mime_type)
		response.write(file)
		response.end()
	}
	else if (request.url === "/index.mjs") {
		response.setHeader("Content-Type", "text/javascript")
		response.write(index_js_code)
		response.end()
	}
	else if (request.url === "/index.html") {
		response.setHeader("Content-Type", "text/html;charset=utf-8")
		response.write(index_html_code)
		response.end()
	}
	else if (request.url === "/runner_slave.mjs") {
		response.setHeader("Content-Type", "text/javascript")
		response.write(runner_slave_code)
		response.end()
	}
	else {
		response.write(`404 not found`)
		response.end()
	}
}
