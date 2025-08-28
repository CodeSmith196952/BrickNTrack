namespace BrickNTrack.Doman.CommonModel
{
    public class ApplicationConstant
    {
        public static class ResultCode
        {
            public static int Success = 200;
            public static int SuccessfullyUpdated = 204;
            public static int SuccessfullyCreated = 201;
            public static int NotAllowed = 405;
            public static int Invalid = 400;
            public static int Unauthorized = 401;
            public static int ExceptionThrown = 202;
            public static int DuplicateRecord = 409;
            public static int RecordNotFound = 404;
        }

        public static class  MilestoneStatus
        {
            public static string Pending = "Pending";
            public static string WIP = "WIP";
            public static string Completed = "Completed";
        }

        public static class BudgetStatusConstant
        {
            public static string OverBudget = "Over budget";
            public static string InBudget = "Under budget";
        }
    }
}
