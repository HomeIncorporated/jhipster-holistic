import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITaskMySuffix } from 'app/shared/model/task-my-suffix.model';

type EntityResponseType = HttpResponse<ITaskMySuffix>;
type EntityArrayResponseType = HttpResponse<ITaskMySuffix[]>;

@Injectable({ providedIn: 'root' })
export class TaskMySuffixService {
  public resourceUrl = SERVER_API_URL + 'api/tasks';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/tasks';

  constructor(protected http: HttpClient) {}

  create(task: ITaskMySuffix): Observable<EntityResponseType> {
    return this.http.post<ITaskMySuffix>(this.resourceUrl, task, { observe: 'response' });
  }

  update(task: ITaskMySuffix): Observable<EntityResponseType> {
    return this.http.put<ITaskMySuffix>(this.resourceUrl, task, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITaskMySuffix>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaskMySuffix[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaskMySuffix[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
