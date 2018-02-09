import { Component, ViewChild, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';

// We need to tell TypeScript that Autodesk exists as a variables/object somewhere globally
declare const Autodesk: any;

@Component({
  selector: 'forge-viewer',
  templateUrl: './forge-viewer.component.html',
  styleUrls: ['./forge-viewer.component.css'],
})
export class ForgeViewerComponent implements OnInit, OnDestroy {
  private selectedSection: any = null;
  @ViewChild('viewerContainer') viewerContainer: any;
  private viewer: any;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.launchViewer();
  }

  ngOnDestroy() {
    if (this.viewer && this.viewer.running) {
      this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.selectionChanged);
      this.viewer.tearDown();
      this.viewer.finish();
      this.viewer = null;
    }
  }

  private launchViewer() {
    if (this.viewer) {
      return;
    }

    const options = {
      env: 'AutodeskProduction',
      getAccessToken: (onSuccess) => { this.getAccessToken(onSuccess) },
    };

    this.viewer = new Autodesk.Viewing.Viewer3D(this.viewerContainer.nativeElement, {}); // Headless viewer

    // Check if the viewer has already been initialised - this isn't the nicest, but we've set the env in our
    // options above so we at least know that it was us who did this!
    if (!Autodesk.Viewing.Private.env) {
      Autodesk.Viewing.Initializer(options, () => {
        this.viewer.initialize();
        this.loadDocument();
      });
    } else {
      // We need to give an initialised viewing application a tick to allow the DOM element to be established before we re-draw
      setTimeout(() => {
        this.viewer.initialize();
        this.loadDocument();
      });
    }
  }

  private loadDocument() {
    const urn = 'urn:<document_urn_here>';

    Autodesk.Viewing.Document.load(urn, (doc) => {
      const geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {type: 'geometry'}, true);

      if (geometryItems.length === 0) {
        return;
      }

      this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.geometryLoaded);
      this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (event) => this.selectionChanged(event));

      this.viewer.load(doc.getViewablePath(geometryItems[0]));
    }, errorMsg => console.error);
  }

  private geometryLoaded(event: any) {
    const viewer = event.target;

    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.geometryLoaded);
    viewer.setLightPreset(8);
    viewer.fitToView();
    // viewer.setQualityLevel(false, true); // Getting rid of Ambientshadows to false to avoid blackscreen problem in Viewer.
  }

  private selectionChanged(event: any) {
    const model = event.model;
    const dbIds = event.dbIdArray;

    // Get properties of object
    this.viewer.getProperties(dbIds[0], (props) => {
       // Do something with properties
    });
  }

  private getAccessToken(onSuccess: any) {
    const access_token = '<token_here>';
    const expires_in = 86399;

    onSuccess(access_token, expires_in);
  }
}
