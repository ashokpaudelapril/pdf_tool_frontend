// frontend/src/utils/api.js

/**
 * Handles API responses, parsing them and optionally creating blob URLs or
 * returning external download URLs for display/download.
 *
 * @param {Response} response The raw fetch API response object.
 * @param {string} expectedFilename A suggested filename for download.
 * @param {string} expectedMediaType The expected MIME type if the response is a direct file.
 * @returns {Promise<{success: boolean, message: string, fileUrl?: string, fileType?: string, error?: any}>}
 */
export const handleApiResponse = async (response, expectedFilename, expectedMediaType) => {
    if (response.ok) {
        const contentType = response.headers.get('Content-Type');

        // Case 1: Backend returns JSON (e.g., success message, or S3/cloud storage URL)
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            if (data.download_url) {
                // Backend sent a direct URL (e.g., from S3)
                return {
                    success: true,
                    message: data.message || 'File processed successfully and ready for download!',
                    fileUrl: data.download_url,
                    fileType: expectedMediaType // We rely on the frontend knowing the type for external URLs
                };
            } else {
                // Generic JSON success message without a file to display
                return {
                    success: true,
                    message: data.message || 'Operation successful.',
                    fileUrl: null, // No file URL to display
                    fileType: null
                };
            }
        }
        // Case 2: Backend returns a direct file (Blob)
        else {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob

            return {
                success: true,
                message: 'File processed successfully and ready for preview!',
                fileUrl: url,
                fileType: contentType || expectedMediaType // Use actual Content-Type from response or fallback
            };
        }
    }
    // Case 3: Server error (response.ok is false)
    else {
        let errorMessage = `Server error: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = `Server error: ${errorData.detail || errorData.message || response.statusText}`;
        } catch (e) {
            // If response body is not JSON, use default status text
        }
        return { success: false, message: errorMessage };
    }
};