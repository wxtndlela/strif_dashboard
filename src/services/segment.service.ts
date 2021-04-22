import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable()
export class SegmentService {

    constructor(
        private api: ApiService,
    ) {}

    private segment_id ;
    private artifacts = [];


    /**
     * start_segment
     */
    public start_segment() {
        
    }

    /**
     * end_segment
     */
    public end_segment() {
        
    }
}