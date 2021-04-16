# API-Design
API Design for a Job posting Website.


## Routes

* [Home]
* [Candidates]
* [Recruiters]


### Home Routes
#### Methods

- **[<code>GET</code> ]** /

List all the open jobs


### Candidate Routes
#### Methods

- **[<code>POST</code> ]** /candidate/signup

Candidate Signup

- **[<code>POST</code> ]** /candidate/login

Candidate Login 

- **[<code>POST</code> ]** /candidate/logout

Candidate Logout

- **[<code>GET</code> ]** /candidate/refresh_token

Details of Token for persistent session

- **[<code>GET</code> ]** /candidate/infor

Candidate Information

- **[<code>GET</code> ]** /candidate/getAppliedJobs

List all the jobs that Candidate has applied to

- **[<code>POST</code> ]** /candidate/apply

Post Request to apply to a job using job_id

- **[<code>POST</code> ]** /candidate/deleteJob

Post Request to delete a job using job_id


### Recruiter Routes
#### Methods

- **[<code>POST</code> ]** /recruiter/signup

Recruiter Signup

- **[<code>POST</code> ]** /recruiter/login

Recruiter Login 

- **[<code>POST</code> ]** /recruiter/logout

Recruiter Logout

- **[<code>GET</code> ]** /recruiter/refresh_token

Details of Token for persistent session

- **[<code>GET</code> ]** /recruiter/infor

Recruiter Information

- **[<code>POST</code> ]** /recruiter/createJob

Post Request to generate a job by Recruiter

- **[<code>GET</code> ]** /recruiter/getJobDetails

Get Request to get the details of all the candidates which have applied to the job listed by Recruiter

- **[<code>POST</code> ]** /recruiter/acceptCandidate

Post Request to accept a candidate

- **[<code>POST</code> ]** /recruiter/rejectCandidate

Post Request to reject a candidate



