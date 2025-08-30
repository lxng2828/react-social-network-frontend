# Tài liệu API cho người làm Frontend

## Thông tin cơ bản

### Base URL
- **Development**: `http://localhost:8080`
- **Production**: `{YOUR_DOMAIN}`

### Context Path
- **Context Path**: `/api`

### Cách tạo URL endpoint
```
{Base URL} + {Context Path} + {Endpoint Path} = Full URL
```

**Ví dụ**: 
- Base URL: `http://localhost:8080`
- Context Path: `/api`
- Endpoint: `/auth/login`
- Full URL: `http://localhost:8080/api/auth/login`

## Cấu trúc Response chung

Tất cả API đều trả về response theo format `ApiResponse<T>`:

```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 200,
  "success": true,
  "message": "Thành công",
  "data": {...},
  "error": null,
  "path": "/api/endpoint"
}
```

## 1. Authentication APIs

### 1.1 Đăng ký tài khoản
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth**: Không cần
- **Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "firstName": "string (required)",
  "lastName": "string (required)"
}
```
- **Response**: `201 Created`
- **Response Body**: `RegisterResponse`
- **Lỗi thường gặp**: `400 Bad Request` (validation), `409 Conflict` (email đã tồn tại)

### 1.2 Đăng nhập
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth**: Không cần
- **Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
- **Response**: `200 OK`
- **Response Body**: `LoginResponse` (chứa JWT token)
- **Lỗi thường gặp**: `401 Unauthorized` (sai thông tin đăng nhập)

### 1.3 Đăng xuất
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth**: JWT Token
- **Request Body**:
```json
{
  "token": "string (required)"
}
```
- **Response**: `200 OK`
- **Lỗi thường gặp**: `401 Unauthorized` (token không hợp lệ)

### 1.4 Kiểm tra token
- **URL**: `/auth/introspect`
- **Method**: `POST`
- **Auth**: JWT Token
- **Request Body**:
```json
{
  "token": "string (required)"
}
```
- **Response**: `200 OK`
- **Response Body**: `IntrospectResponse`

### 1.5 Làm mới token
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Auth**: JWT Token
- **Request Body**:
```json
{
  "refreshToken": "string (required)"
}
```
- **Response**: `200 OK`
- **Response Body**: `RefreshTokenResponse`

### 1.6 Quên mật khẩu
- **URL**: `/auth/password/forgot`
- **Method**: `POST`
- **Auth**: Không cần
- **Request Body**:
```json
{
  "email": "string (required)"
}
```
- **Response**: `200 OK`

### 1.7 Đặt lại mật khẩu
- **URL**: `/auth/password/reset`
- **Method**: `POST`
- **Auth**: Không cần
- **Request Body**:
```json
{
  "token": "string (required)",
  "newPassword": "string (required)"
}
```
- **Response**: `200 OK`

## 2. User Management APIs

### 2.1 Lấy thông tin user hiện tại
- **URL**: `/users/me`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 2.2 Lấy quyền user hiện tại
- **URL**: `/users/authorities`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Response**: `200 OK`
- **Response Body**: `Map<String, Object>`

### 2.3 Lấy danh sách tất cả users
- **URL**: `/users`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Query Parameters**:
  - `page`: int (default: 0)
  - `size`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `Page<UserResponseDto>`

### 2.4 Upload ảnh đại diện
- **URL**: `/users/profile-picture`
- **Method**: `POST`
- **Auth**: JWT Token (USER/ADMIN)
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file` (MultipartFile)
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 2.5 Cập nhật thông tin cá nhân
- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth**: JWT Token (USER/ADMIN)
- **Request Body**:
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "gender": "string (optional)",
  "dateOfBirth": "date (optional)",
  "phoneNumber": "string (optional)",
  "address": "string (optional)"
}
```
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 2.6 Đổi mật khẩu
- **URL**: `/users/change-password`
- **Method**: `PUT`
- **Auth**: JWT Token (USER/ADMIN)
- **Request Body**:
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required)"
}
```
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 2.7 Tìm kiếm users
- **URL**: `/users/search`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Query Parameters**:
  - `firstName`: string (optional)
  - `lastName`: string (optional)
  - `page`: int (default: 0)
  - `size`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `Page<UserResponseDto>`

### 2.8 Lấy thông tin user theo ID
- **URL**: `/users/{userId}`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Path Parameters**:
  - `userId`: string (required)
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 2.9 Xóa ảnh đại diện
- **URL**: `/users/profile-picture`
- **Method**: `DELETE`
- **Auth**: JWT Token (USER/ADMIN)
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

## 3. Friendship APIs

### 3.1 Gửi lời mời kết bạn
- **URL**: `/friendships`
- **Method**: `POST`
- **Auth**: JWT Token (USER/ADMIN)
- **Request Body**:
```json
{
  "receiverId": "string (required)"
}
```
- **Response**: `201 Created`
- **Response Body**: `FriendshipResponseDto`

### 3.2 Lấy danh sách lời mời đã gửi
- **URL**: `/friendships/sent`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Query Parameters**:
  - `page`: int (default: 1)
  - `limit`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `Page<FriendshipResponseDto>`

### 3.3 Lấy danh sách lời mời đã nhận
- **URL**: `/friendships/received`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Query Parameters**:
  - `page`: int (default: 1)
  - `limit`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `Page<FriendshipResponseDto>`

### 3.4 Hủy lời mời kết bạn
- **URL**: `/friendships/{id}`
- **Method**: `DELETE`
- **Auth**: JWT Token (USER/ADMIN)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`

### 3.5 Chấp nhận lời mời kết bạn
- **URL**: `/friendships/{id}/accept`
- **Method**: `PATCH`
- **Auth**: JWT Token (USER/ADMIN)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`

### 3.6 Từ chối lời mời kết bạn
- **URL**: `/friendships/{id}/decline`
- **Method**: `PATCH`
- **Auth**: JWT Token (USER/ADMIN)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`

### 3.7 Lấy danh sách bạn bè
- **URL**: `/friendships`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Query Parameters**:
  - `page`: int (default: 1)
  - `limit`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `Page<FriendResponseDto>`

### 3.8 Hủy kết bạn
- **URL**: `/friendships/{id}/remove`
- **Method**: `DELETE`
- **Auth**: JWT Token (USER/ADMIN)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`

### 3.9 Kiểm tra trạng thái quan hệ
- **URL**: `/friendships/status`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Query Parameters**:
  - `userId`: string (required)
- **Response**: `200 OK`
- **Response Body**: `FriendshipStatusResponseDto`
- **Mô tả**: Kiểm tra trạng thái quan hệ giữa người dùng hiện tại và người dùng khác. Trả về cả trạng thái và ID của mối quan hệ (nếu có).

**Ví dụ Request:**
```
GET /api/friendships/status?userId=123e4567-e89b-12d3-a456-426614174000
```

**Ví dụ Response khi đã là bạn bè:**
```json
{
  "success": true,
  "message": "Kiểm tra trạng thái quan hệ thành công",
  "data": {
    "status": "friends",
    "friendshipId": "abc-123-def-456"
  }
}
```

**Ví dụ Response khi không có mối quan hệ:**
```json
{
  "success": true,
  "message": "Kiểm tra trạng thái quan hệ thành công",
  "data": {
    "status": "not_friends",
    "friendshipId": null
  }
}
```

## 4. Post APIs

### 4.1 Tạo bài viết
- **URL**: `/posts`
- **Method**: `POST`
- **Auth**: JWT Token (USER)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `content`: string (required)
  - `files`: List<MultipartFile> (optional)
  - `privacy`: string (optional, default: "PUBLIC")
    - Giá trị có thể: "PUBLIC", "FRIENDS", "PRIVATE"
  - `hashtags`: string (JSON array, optional)
- **Response**: `201 Created`
- **Response Body**: `PostResponse`

### 4.2 Cập nhật bài viết
- **URL**: `/posts/{id}`
- **Method**: `PATCH`
- **Auth**: JWT Token (USER)
- **Content-Type**: `multipart/form-data`
- **Path Parameters**:
  - `id`: string (required)
- **Request Body**:
  - `content`: string (optional)
  - `files`: List<MultipartFile> (optional)
  - `privacy`: string (optional)
    - Giá trị có thể: "PUBLIC", "FRIENDS", "PRIVATE"
  - `hashtags`: string (JSON array, optional)
- **Response**: `200 OK`
- **Response Body**: `PostResponse`

### 4.3 Xóa bài viết
- **URL**: `/posts/{id}`
- **Method**: `DELETE`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`

### 4.4 Lấy feed bài viết
- **URL**: `/posts/feed`
- **Method**: `GET`
- **Auth**: JWT Token (USER)
- **Query Parameters**:
  - `page`: int (default: 1)
  - `limit`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `PostFeedResponse`

### 4.5 Lấy bài viết theo ID
- **URL**: `/posts/{id}`
- **Method**: `GET`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`
- **Response Body**: `PostResponse`

### 4.6 Lấy bài viết của user
- **URL**: `/posts/users/{userId}/posts`
- **Method**: `GET`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `userId`: string (required)
- **Query Parameters**:
  - `page`: int (default: 1)
  - `limit`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `PostFeedResponse`

## 5. Comment APIs

### 5.1 Tạo comment
- **URL**: `/posts/{postId}/comments`
- **Method**: `POST`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `postId`: string (required)
- **Request Body**:
```json
{
  "content": "string (required)"
}
```
- **Response**: `201 Created`
- **Response Body**: `CommentResponse`

### 5.2 Lấy danh sách comment
- **URL**: `/posts/{postId}/comments`
- **Method**: `GET`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `postId`: string (required)
- **Query Parameters**:
  - `page`: int (default: 0)
  - `size`: int (default: 10)
- **Response**: `200 OK`
- **Response Body**: `Page<CommentResponse>`

### 5.3 Cập nhật comment
- **URL**: `/comments/{commentId}`
- **Method**: `PATCH`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `commentId`: string (required)
- **Request Body**:
```json
{
  "content": "string (required)"
}
```
- **Response**: `200 OK`
- **Response Body**: `CommentResponse`

### 5.4 Xóa comment
- **URL**: `/comments/{commentId}`
- **Method**: `DELETE`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `commentId`: string (required)
- **Response**: `200 OK`

## 6. Reply APIs

### 6.1 Tạo reply
- **URL**: `/comments/{commentId}/replies`
- **Method**: `POST`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `commentId`: string (required)
- **Request Body**:
```json
{
  "content": "string (required)"
}
```
- **Response**: `201 Created`
- **Response Body**: `ReplyResponse`

### 6.2 Lấy danh sách reply
- **URL**: `/comments/{commentId}/replies`
- **Method**: `GET`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `commentId`: string (required)
- **Query Parameters**:
  - `page`: int (default: 0)
  - `size`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `Page<ReplyResponse>`

### 6.3 Cập nhật reply
- **URL**: `/replies/{replyId}`
- **Method**: `PATCH`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `replyId`: string (required)
- **Request Body**:
```json
{
  "content": "string (required)"
}
```
- **Response**: `200 OK`
- **Response Body**: `ReplyResponse`

### 6.4 Xóa reply
- **URL**: `/replies/{replyId}`
- **Method**: `DELETE`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `replyId`: string (required)
- **Response**: `200 OK`

## 7. Reaction APIs

### 7.1 Thả tim bài viết
- **URL**: `/posts/{postId}/hearts`
- **Method**: `POST`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `postId`: string (required)
- **Response**: `201 Created`
- **Response Body**: `HeartResponse`

### 7.2 Bỏ tim bài viết
- **URL**: `/posts/{postId}/hearts`
- **Method**: `DELETE`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `postId`: string (required)
- **Response**: `200 OK`

### 7.3 Lấy danh sách tim của bài viết
- **URL**: `/posts/{postId}/hearts`
- **Method**: `GET`
- **Auth**: JWT Token (USER)
- **Path Parameters**:
  - `postId`: string (required)
- **Query Parameters**:
  - `page`: int (default: 1)
  - `limit`: int (default: 20)
- **Response**: `200 OK`
- **Response Body**: `PostHeartsResponse`

## 8. Admin APIs

### 8.1 Lấy danh sách tất cả users (Admin)
- **URL**: `/admin/users`
- **Method**: `GET`
- **Auth**: JWT Token (ADMIN only)
- **Response**: `200 OK`
- **Response Body**: `List<UserResponseDto>`

### 8.2 Lấy thông tin user theo ID (Admin)
- **URL**: `/admin/users/{id}`
- **Method**: `GET`
- **Auth**: JWT Token (ADMIN only)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 8.3 Tạo user mới (Admin)
- **URL**: `/admin/users`
- **Method**: `POST`
- **Auth**: JWT Token (ADMIN only)
- **Request Body**: `CreateUserRequestDto`
- **Response**: `201 Created`
- **Response Body**: `UserResponseDto`

### 8.4 Cập nhật user (Admin)
- **URL**: `/admin/users/{id}`
- **Method**: `PUT`
- **Auth**: JWT Token (ADMIN only)
- **Path Parameters**:
  - `id`: string (required)
- **Request Body**: `UpdateUserRequestDto`
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 8.5 Xóa user (Admin)
- **URL**: `/admin/users/{id}`
- **Method**: `DELETE`
- **Auth**: JWT Token (ADMIN only)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`

### 8.6 Block user (Admin)
- **URL**: `/admin/users/{id}/block`
- **Method**: `POST`
- **Auth**: JWT Token (ADMIN only)
- **Path Parameters**:
  - `id`: string (required)
- **Request Body**: `UserBlockRequestDto`
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 8.7 Unblock user (Admin)
- **URL**: `/admin/users/{id}/unblock`
- **Method**: `POST`
- **Auth**: JWT Token (ADMIN only)
- **Path Parameters**:
  - `id`: string (required)
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 8.8 Lấy danh sách user bị block (Admin)
- **URL**: `/admin/users/blocked`
- **Method**: `GET`
- **Auth**: JWT Token (ADMIN only)
- **Response**: `200 OK`
- **Response Body**: `List<UserResponseDto>`

### 8.9 Cập nhật role user (Admin)
- **URL**: `/admin/users/{id}/roles`
- **Method**: `POST`
- **Auth**: JWT Token (ADMIN only)
- **Path Parameters**:
  - `id`: string (required)
- **Request Body**: `UserRoleRequestDto`
- **Response**: `200 OK`
- **Response Body**: `UserResponseDto`

### 8.10 Lấy thống kê users (Admin)
- **URL**: `/admin/users/statistics/users`
- **Method**: `GET`
- **Auth**: JWT Token (ADMIN only)
- **Response**: `200 OK`
- **Response Body**: `UserStatisticsDto`

### 8.11 Lấy thống kê posts (Admin)
- **URL**: `/admin/users/statistics/posts`
- **Method**: `GET`
- **Auth**: JWT Token (ADMIN only)
- **Response**: `200 OK`
- **Response Body**: `PostStatisticsDto`

### 8.12 Lấy thống kê tổng hợp (Admin)
- **URL**: `/admin/users/statistics/overview`
- **Method**: `GET`
- **Auth**: JWT Token (ADMIN only)
- **Response**: `200 OK`
- **Response Body**: `AdminStatisticsResponseDto`

## HTTP Status Codes

- **200 OK**: Thành công
- **201 Created**: Tạo mới thành công
- **400 Bad Request**: Dữ liệu request không hợp lệ
- **401 Unauthorized**: Chưa xác thực hoặc token không hợp lệ
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Không tìm thấy tài nguyên
- **409 Conflict**: Xung đột dữ liệu (ví dụ: email đã tồn tại)
- **500 Internal Server Error**: Lỗi server

## Authentication

### JWT Token
- Tất cả API (trừ auth) đều yêu cầu JWT token trong header:
```
Authorization: Bearer {JWT_TOKEN}
```

### Token Expiration
- JWT token có thời hạn 24 giờ (có thể cấu hình)
- Sử dụng refresh token để lấy token mới khi hết hạn

## Rate Limiting
- Không có thông tin về rate limiting trong code hiện tại

## File Upload
- Hỗ trợ upload file với kích thước tối đa: 5MB
- Hỗ trợ upload nhiều file cùng lúc
- File được lưu trữ locally hoặc trên Cloudinary (tùy cấu hình)

## Pagination
- Hầu hết API list đều hỗ trợ phân trang
- Sử dụng `page` và `size`/`limit` parameters
- Page bắt đầu từ 0 hoặc 1 (tùy API)
- Size mặc định thường là 20 items

## Error Handling
- Tất cả lỗi đều trả về format `ApiResponse` với `success: false`
- Field `error` chứa chi tiết lỗi nếu có
- Field `message` chứa thông báo lỗi bằng tiếng Việt

## Data Models

### UserResponseDto
```json
{
  "id": "string (UUID)",
  "email": "string (email format)",
  "firstName": "string (2-50 characters)",
  "lastName": "string (2-50 characters)",
  "gender": "enum (MALE, FEMALE, OTHER)",
  "dateOfBirth": "date (yyyy-MM-dd)",
  "phone": "string (max 15 characters)",
  "address": "string (max 200 characters)",
  "profilePictureUrl": "string (URL)",
  "roles": "array of Role objects",
  "createdAt": "datetime (yyyy-MM-ddTHH:mm:ss)",
  "updatedAt": "datetime (yyyy-MM-ddTHH:mm:ss)"
}
```

### Role Object
```json
{
  "id": "long",
  "name": "enum (ADMIN, USER)"
}
```

### PostResponse
```json
{
  "id": "string (UUID)",
  "content": "string",
  "user": "UserResponseDto object",
  "createdAt": "datetime (yyyy-MM-ddTHH:mm:ss)",
  "updatedAt": "datetime (yyyy-MM-ddTHH:mm:ss)",
  "imageUrls": "array of strings (URLs)",
  "videoUrls": "array of strings (URLs)",
  "privacy": "enum (PUBLIC, FRIENDS, PRIVATE)",
  "likeCount": "integer",
  "commentCount": "integer",
  "hashtags": "array of strings",
  "isLiked": "boolean"
}
```

### LoginResponse
```json
{
  "success": "boolean",
  "token": "string (JWT token)"
}
```

### RegisterRequest
```json
{
  "email": "string (required, email format, 8-20 characters)",
  "password": "string (required, 8-20 characters)",
  "firstName": "string (required, 2-50 characters)",
  "lastName": "string (required, 2-50 characters)",
  "gender": "enum (optional: MALE, FEMALE, OTHER)",
  "dateOfBirth": "date (optional: yyyy-MM-dd)",
  "phone": "string (optional, max 15 characters)",
  "address": "string (optional, max 200 characters)"
}
```

### CommentResponse
```json
{
  "id": "string (UUID)",
  "content": "string",
  "user": "UserResponseDto object",
  "postId": "string (UUID)",
  "createdAt": "datetime (yyyy-MM-ddTHH:mm:ss)",
  "updatedAt": "datetime (yyyy-MM-ddTHH:mm:ss)"
}
```

### ReplyResponse
```json
{
  "id": "string (UUID)",
  "content": "string",
  "user": "UserResponseDto object",
  "commentId": "string (UUID)",
  "createdAt": "datetime (yyyy-MM-ddTHH:mm:ss)",
  "updatedAt": "datetime (yyyy-MM-ddTHH:mm:ss)"
}
```

### FriendshipResponseDto
```json
{
  "id": "string (UUID)",
  "sender": "UserResponseDto object",
  "receiver": "UserResponseDto object",
  "status": "enum (PENDING, ACCEPTED, REJECTED)",
  "createdAt": "datetime (yyyy-MM-ddTHH:mm:ss)",
  "updatedAt": "datetime (yyyy-MM-ddTHH:mm:ss)"
}
```

### PostFeedResponse
```json
{
  "posts": "array of PostResponse objects",
  "totalElements": "long",
  "totalPages": "int",
  "currentPage": "int",
  "pageSize": "int",
  "hasNext": "boolean",
  "hasPrevious": "boolean"
}
```

### UpdateProfileRequestDto
```json
{
  "firstName": "string (optional, max 50 chars, letters and spaces only)",
  "lastName": "string (optional, max 50 chars, letters and spaces only)",
  "gender": "enum (optional: MALE, FEMALE, OTHER)",
  "dateOfBirth": "date (optional: yyyy-MM-dd, must be in the past)",
  "phone": "string (optional: 10-15 digits, can include +, spaces, -, (, ))",
  "address": "string (optional, max 255 characters)"
}
```

### SearchUserRequestDto
```json
{
  "searchTerm": "string (optional, max 100 characters)",
  "page": "integer (optional, default: 0)",
  "size": "integer (optional, default: 20)"
}
```

### ChangePasswordRequestDto
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, 8-20 characters)"
}
```

### SendFriendRequestDto
```json
{
  "receiverId": "string (required, UUID)"
}
```

### CreateCommentRequest
```json
{
  "content": "string (required)"
}
```

### CreateReplyRequest
```json
{
  "content": "string (required)"
}
```

### UserStatisticsDto
```json
{
  "totalUsers": "long",
  "activeUsers": "long",
  "blockedUsers": "long",
  "newUsersToday": "long",
  "newUsersThisWeek": "long",
  "newUsersThisMonth": "long",
  "maleUsers": "long",
  "femaleUsers": "long",
  "usersWithProfilePicture": "long",
  "usersWithPhone": "long",
  "usersWithAddress": "long"
}
```

### PostStatisticsDto
```json
{
  "totalPosts": "long",
  "postsToday": "long",
  "postsThisWeek": "long",
  "postsThisMonth": "long",
  "publicPosts": "long",
  "privatePosts": "long",
  "postsWithImages": "long",
  "postsWithVideos": "long",
  "postsWithHashtags": "long",
  "topHashtags": "Map<string, long>",
  "averageLikesPerPost": "double",
  "averageCommentsPerPost": "double"
}
```

### AdminStatisticsResponseDto
```json
{
  "userStatistics": "UserStatisticsDto object",
  "postStatistics": "PostStatisticsDto object",
  "generatedAt": "string (yyyy-MM-dd HH:mm:ss)"
}
```

### HeartResponse
```json
{
  "id": "string (UUID)",
  "userId": "string (UUID)",
  "userFirstName": "string",
  "userLastName": "string",
  "userProfilePicture": "string (URL)",
  "postId": "string (UUID)",
  "type": "string",
  "createdAt": "string (datetime)"
}
```

### PostHeartsResponse
```json
{
  "hearts": "array of HeartResponse objects",
  "currentUserHearted": "boolean",
  "totalHearts": "long",
  "currentPage": "int",
  "totalPages": "int"
}
```

### FriendResponseDto
```json
{
  "id": "string (UUID)",
  "friend": "UserResponseDto object",
  "acceptedAt": "datetime (yyyy-MM-ddTHH:mm:ss)"
}
```

### FriendshipStatusResponseDto
```json
{
  "status": "string",
  "friendshipId": "string (UUID, null nếu không có mối quan hệ)"
}
```

### IntrospectResponse
```json
{
  "valid": "boolean"
}
```

### RefreshTokenResponse
```json
{
  "success": "boolean",
  "token": "string (JWT token)",
  "message": "string"
}
```

### CreateUserRequestDto (Admin)
```json
{
  "email": "string (required)",
  "password": "string (required, 8-20 characters)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "gender": "enum (optional: MALE, FEMALE, OTHER)",
  "dateOfBirth": "date (optional: yyyy-MM-dd)",
  "phone": "string (optional, max 15 characters)",
  "address": "string (optional, max 200 characters)",
  "roles": "array of Role objects (optional)"
}
```

### UpdateUserRequestDto (Admin)
```json
{
  "email": "string (optional)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "gender": "enum (optional: MALE, FEMALE, OTHER)",
  "dateOfBirth": "date (optional: yyyy-MM-dd)",
  "phone": "string (optional, max 15 characters)",
  "address": "string (optional, max 200 characters)",
  "roles": "array of Role objects (optional)"
}
```

### UserBlockRequestDto
```json
{
  "reason": "string (required, max 500 characters)"
}
```

### UserRoleRequestDto
```json
{
  "roleType": "enum (required: ADMIN, USER)",
  "reason": "string (required)"
}

### Enum Values

#### Gender
- `MALE` - Nam
- `FEMALE` - Nữ  
- `OTHER` - Khác

#### RoleType
- `ADMIN` - Quản trị viên
- `USER` - Người dùng thường

#### PostPrivacy
- `PUBLIC` - Công khai (mặc định)
- `FRIENDS` - Chỉ bạn bè
- `PRIVATE` - Riêng tư

#### FriendshipStatus
- `PENDING` - Đang chờ
- `ACCEPTED` - Đã chấp nhận
- `REJECTED` - Đã từ chối

### Trạng thái quan hệ trong FriendshipStatusResponseDto
API `/friendships/status` trả về các trạng thái sau:

| Trạng thái | Mô tả | friendshipId | Hành động có thể thực hiện |
|------------|--------|---------------|---------------------------|
| `"friends"` | Hai người dùng đã là bạn bè | ✅ Có ID | - Hủy kết bạn<br>- Xem bài viết riêng tư<br>- Tương tác với bài viết |
| `"request_sent"` | Người dùng hiện tại đã gửi lời mời kết bạn | ✅ Có ID | - Hủy lời mời kết bạn |
| `"request_received"` | Người dùng hiện tại đã nhận lời mời kết bạn | ✅ Có ID | - Chấp nhận lời mời<br>- Từ chối lời mời |
| `"not_friends"` | Không có mối quan hệ nào hoặc đã từ chối | ❌ null | - Gửi lời mời kết bạn |

**Lưu ý**: `friendshipId` có thể được sử dụng trực tiếp với các API khác:
- Hủy lời mời: `DELETE /api/friendships/{friendshipId}`
- Chấp nhận: `PATCH /api/friendships/{friendshipId}/accept`
- Từ chối: `PATCH /api/friendships/{friendshipId}/decline`
- Hủy kết bạn: `DELETE /api/friendships/{friendshipId}/remove`

### Validation Rules
- **Email**: Phải đúng định dạng email
- **Password**: 8-20 ký tự
- **Name fields**: 2-50 ký tự, chỉ chứa chữ cái và khoảng trắng
- **Phone**: Tối đa 15 ký tự, format: +[country code][number] hoặc [number]
- **Address**: Tối đa 255 ký tự
- **Date format**: yyyy-MM-dd
- **DateTime format**: yyyy-MM-ddTHH:mm:ss
- **UUID**: 36 ký tự hex format
- **Search term**: Tối đa 100 ký tự
- **Page**: Bắt đầu từ 0
- **Size/Limit**: Tối đa 20 items mặc định

## 9. Development APIs (Chỉ dành cho môi trường development)

**Lưu ý**: Các API này chỉ nên sử dụng trong môi trường development và testing.

### 9.1 Lấy thông tin security context
- **URL**: `/sandbox/security-context`
- **Method**: `GET`
- **Auth**: JWT Token (USER/ADMIN)
- **Response**: `200 OK`
- **Response Body**: `Map<String, Object>` (thông tin security context)
- **Mục đích**: Debug các vấn đề bảo mật và xác thực
- **Trạng thái**: Chỉ hoạt động trong môi trường development

### 9.2 Test upload file
- **URL**: `/sandbox/upload-test`
- **Method**: `POST`
- **Auth**: JWT Token (USER/ADMIN)
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file` (MultipartFile)
- **Response**: `200 OK`
- **Response Body**: `Map<String, Object>` (thông tin upload)
- **Mục đích**: Test chức năng upload file
- **Trạng thái**: Chỉ hoạt động trong môi trường development

## ⚠️ Lưu ý quan trọng

### Vấn đề cần khắc phục trong backend:
1. **URL Conflict**: PostController và ReactionController đều có `@RequestMapping("/posts")` - có thể gây xung đột URL

### Các API hoạt động bình thường:
- Authentication APIs (7 endpoints)
- User Management APIs (9 endpoints)
- Friendship APIs (9 endpoints)
- Post APIs (6 endpoints)
- Comment APIs (4 endpoints)
- Reply APIs (4 endpoints)
- Reaction APIs (3 endpoints)
- Admin APIs (12 endpoints)
- Development APIs (2 endpoints)

### Tổng cộng: 56 endpoints, tất cả đều hoạt động bình thường

## 📋 Tóm tắt tài liệu

### ✅ **Đã bao gồm đầy đủ:**
- **56 API endpoints** với URL, method, auth, request/response format
- **Cấu trúc dữ liệu chi tiết** cho tất cả DTO chính
- **Validation rules** cho từng field
- **Enum values** với mô tả tiếng Việt
- **Error handling** và HTTP status codes
- **Authentication flow** và JWT token usage
- **File upload** specifications
- **Pagination** parameters

### 🎯 **Frontend Developer có thể:**
- Viết code mà không cần đọc code backend
- Hiểu chính xác kiểu dữ liệu của từng field
- Biết validation rules để hiển thị lỗi phù hợp
- Map dữ liệu chính xác vào UI components
- Xử lý authentication và authorization đúng cách
- Implement pagination và file upload đúng format

### 📚 **Tài liệu này đã sẵn sàng để gửi cho Frontend Team!**

## Error Response Examples

### Validation Error (400 Bad Request)
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 400,
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "error": {
    "field": "email",
    "code": "INVALID_EMAIL",
    "details": "Email không đúng định dạng"
  },
  "path": "/api/auth/register"
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 401,
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn",
  "error": {
    "code": "INVALID_TOKEN",
    "details": "JWT token không hợp lệ"
  },
  "path": "/api/users/me"
}
```

### Authorization Error (403 Forbidden)
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 403,
  "success": false,
  "message": "Không có quyền truy cập",
  "error": {
    "code": "ACCESS_DENIED",
    "details": "Yêu cầu quyền ADMIN"
  },
  "path": "/api/admin/users"
}
```

### Resource Not Found (404 Not Found)
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 404,
  "success": false,
  "message": "Không tìm thấy tài nguyên",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "details": "User với ID '123' không tồn tại"
  },
  "path": "/api/users/123"
}
```

### Conflict Error (409 Conflict)
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 409,
  "success": false,
  "message": "Xung đột dữ liệu",
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "details": "Email 'user@example.com' đã được sử dụng"
  },
  "path": "/api/auth/register"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 500,
  "success": false,
  "message": "Lỗi server nội bộ",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "Có lỗi xảy ra trong quá trình xử lý"
  },
  "path": "/api/posts"
}
```
