import { AbstractResource } from './AbstractResource'
import { ResourceUtils } from '../../util/ResourceUtils'
import fs from 'fs'

export abstract class AbstractFileResolvingResource extends AbstractResource {
  exists () {
    try {
			const url = this.getURL()
			if (ResourceUtils.isFileURL(url)) {
				// Proceed with file system resolution
				return fs.existsSync(url.pathname)
			}
			else {
        console.log(`url(${url}) not support!`)
        return false
				// Try a URL connection content-length header
        // URLConnection con = url.openConnection()
        // customizeConnection(con)
        // HttpURLConnection httpCon =
        // 		(con instanceof HttpURLConnection ? (HttpURLConnection) con : null)
        // if (httpCon != null) {
        // 	int code = httpCon.getResponseCode()
        // 	if (code == HttpURLConnection.HTTP_OK) {
        // 		return true
        // 	}
        // 	else if (code == HttpURLConnection.HTTP_NOT_FOUND) {
        // 		return false
        // 	}
        // }
        // if (con.getContentLengthLong() > 0) {
        // 	return true
        // }
        // if (httpCon != null) {
        // 	// No HTTP OK status, and no content-length header: give up
        // 	httpCon.disconnect()
        // 	return false
        // }
        // else {
        // 	// Fall back to stream existence: can we open the stream?
        // 	getInputStream().close()
        // 	return true
        // }
			}
		}
		catch (ex) {
			return false
		}
  }
}
