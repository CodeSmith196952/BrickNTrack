namespace BrickNTrack.Domain.CommonModel
{
    public class ServiceResult
    {
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public List<string> Errors { get; set; } = new();

        public static ServiceResult Ok(string message = "Success")
            => new() { Success = true, StatusCode = 200, Message = message };

        public static ServiceResult Created(string message = "Created successfully")
            => new() { Success = true, StatusCode = 201, Message = message };

        public static ServiceResult Fail(string message, int statusCode = 400)
            => new() { Success = false, StatusCode = statusCode, Message = message };

        public static ServiceResult NotFound(string message = "Not found")
            => new() { Success = false, StatusCode = 404, Message = message };

        public static ServiceResult Unauthorized(string message = "Unauthorized")
            => new() { Success = false, StatusCode = 401, Message = message };

        public static ServiceResult Conflict(string message = "Conflict")
            => new() { Success = false, StatusCode = 409, Message = message };
    }

    public class ServiceResult<T> : ServiceResult
    {
        public T? Data { get; set; }

        public static ServiceResult<T> Ok(T data, string message = "Success")
            => new() { Success = true, StatusCode = 200, Message = message, Data = data };

        public static new ServiceResult<T> Created(string message = "Created successfully")
            => new() { Success = true, StatusCode = 201, Message = message };

        public static ServiceResult<T> Created(T data, string message = "Created successfully")
            => new() { Success = true, StatusCode = 201, Message = message, Data = data };

        public static new ServiceResult<T> Fail(string message, int statusCode = 400)
            => new() { Success = false, StatusCode = statusCode, Message = message };

        public static new ServiceResult<T> NotFound(string message = "Not found")
            => new() { Success = false, StatusCode = 404, Message = message };

        public static new ServiceResult<T> Unauthorized(string message = "Unauthorized")
            => new() { Success = false, StatusCode = 401, Message = message };
    }
}
