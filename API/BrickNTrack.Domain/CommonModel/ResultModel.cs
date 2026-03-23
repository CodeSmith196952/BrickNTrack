namespace BrickNTrack.Domain.CommonModel
{
    public class ResultModel
    {
        public int StatusCode { get; set; }
        public string ErrorMessage { get; set; }
        public string Exception { get; set; }
        public string ResponseMessage { get; set; }
    }
}
