using LearningManagementSystem.Application.Configuration;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel;
using Minio.DataModel.Args;

namespace LearningManagementSystem.Application.Service;

public class UploadService(IOptions<MinIoConfiguration> config) : IUploadService
{
    private readonly IMinioClient _client = new MinioClient()
        .WithEndpoint(config.Value.Endpoint)
        .WithCredentials(config.Value.AccessKey, config.Value.SecretKey)
        .WithSSL(config.Value.WithSsl)
        .WithRegion("us-east-1")
        .Build();
    public async Task<(string uploadUrl, string resultUrl, IDictionary<string, string> fields)> RequestUpload(User user, string objectName, int exp)
    {
        string bucketName = $"{user.Id}-bucket";
        
        bool exists = await _client.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName));
        if (!exists)
            await _client.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));
        
        string readOnlyPolicy = $@"
{{
  ""Version"": ""2012-10-17"",
  ""Statement"": [
    {{
      ""Effect"": ""Allow"",
      ""Principal"": {{ ""AWS"": ""*"" }},
      ""Action"": [""s3:GetObject""],
      ""Resource"": [""arn:aws:s3:::{bucketName}/*""]
    }}
  ]
}}";

        await _client.SetPolicyAsync(new SetPolicyArgs()
            .WithBucket(bucketName)
            .WithPolicy(readOnlyPolicy));
        
        if (string.IsNullOrWhiteSpace(objectName))
            throw new ArgumentException("fileName cannot be empty");
        
        var policy = new PostPolicy();
        
        policy.SetBucket(bucketName); // set buket
        
        policy.SetKey(objectName); // set file name
        
        policy.SetExpires(DateTime.Now.AddSeconds(exp));
        
        policy.SetContentRange(0, 1 * 1024 * 1024);

        string resultUrl = $"{(config.Value.WithSsl ? "https": "http")}://{config.Value.Endpoint}/{bucketName}/{objectName}";
        
        var formData = await _client.PresignedPostPolicyAsync(policy);
        return (uploadUrl: formData.Item1.ToString(), resultUrl, fields: formData.Item2);
    }
}