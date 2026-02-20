
## File Upload API

### `upload_file.php`

**Endpoint:** `POST /admin/price_estimation/upload_file.php`

**Description:**
Handles single file uploads for price estimation attachments. Validates file size and type, stores the file in `admin/uploads/price_estimation/`, and returns the file path.

**Request:**
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: The file object to upload (Required).

**Validation Rules:**
- **Max Size:** 5MB (5 * 1024 * 1024 bytes).
- **Allowed Types:** `image/jpeg`, `image/png`, `application/pdf`.

**Responses:**

**Success (200 OK):**
```json
{
  "status": "success",
  "message": "File uploaded successfully.",
  "data": {
    "fileName": "original_design.pdf",
    "filePath": "uploads/price_estimation/1715423000_uniqueid.pdf",
    "fileSize": 1048576
  }
}
```

**Error (400 Bad Request):**
```json
{
  "status": "error",
  "message": "File size exceeds 5MB limit."
}
```
OR
```json
{
  "status": "error",
  "message": "Invalid file type. Only JPG, PNG, and PDF are allowed."
}
```
